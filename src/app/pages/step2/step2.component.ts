import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import 'rxjs/add/operator/filter';
import {CalculationResponseModel} from '../../models/calculation-response.model';
import {WebShopApiService} from '../../services/web-shop-api.service';
import {CalculationRequestModel} from '../../models/calculation-request.model';

@Component({
  selector: 'app-step2',
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.less']
})
export class Step2Component implements OnInit {
  // day combo
  showDayDrop = false;
  insuranceDay: number;
  daysArray: number[] = [];

  // month combo
  showMonthDrop = false;
  insuranceMonth: number;
  monthsArray: number[] = [];

  // year combo
  showYearDrop = false;
  insuranceYear: number;
  yearsArray: number[] = [];

  // product options
  travel = false;
  travelStar = false;
  cancellation = false;
  travelModal = false;
  travelStarModal = false;
  showCancellation = false;
  errorMessage = '';

  type: string;
  insuredFirstSum = false;
  insuredSecondSum = false;

  calculationRequestModel: CalculationRequestModel = new CalculationRequestModel();
  calculateResponseModel: CalculationResponseModel[] = [];
  firstTravelOption: CalculationResponseModel = new CalculationResponseModel();
  secondTravelOption: CalculationResponseModel = new CalculationResponseModel();
  travelStarOption: CalculationResponseModel = new CalculationResponseModel();

  constructor(private route: ActivatedRoute, private webShopApiService: WebShopApiService, private router: Router) {
  }

  ngOnInit() {
    this.route.queryParams
      .filter(params => params.type)
      .subscribe(params => {
        this.type = params.type;
        this.calculationRequestModel.tariff.insuranceCoverage = this.type === 'individual' ? 1 : 2;
      });

    this.route.params.subscribe(
      (params: Params) => {
        this.calculationRequestModel.tariff.insuranceBeginDate = params['insuranceBeginDate'];
        this.calculationRequestModel.tariff.insuranceEndDate = params['fullYear'] === 'true' ? null : params['insuranceEndDate'];
        this.calculationRequestModel.tariff.fullYear = params['fullYear'];
        this.calculationRequestModel.tariff.travelReason = params['travelReason'];

        const beginDate: string = params['insuranceBeginDate'];
        if (beginDate) {
          const dateOfTravel: Date = new Date(new Date(beginDate).toDateString());
          const currentDate: Date = new Date(new Date().toDateString());
          if (Math.ceil((dateOfTravel.getTime() - currentDate.getTime()) /  (1000 * 3600 * 24)) >= 30) {
            this.showCancellation = true;
          }
        }
      }
    );

    this.calculateResponseModel = this.route.snapshot.data.calculationResponseModel;

    if (this.type === 'individual') {
      this.firstTravelOption = this.calculateResponseModel.find(x => x.productVariant === 1 && x.amountInsured === 12000);
      this.secondTravelOption = this.calculateResponseModel.find(x => x.productVariant === 1 && x.amountInsured === 32000);
    } else {
      this.firstTravelOption = this.calculateResponseModel.find(x => x.productVariant === 1 && x.amountInsured === 24000);
      this.secondTravelOption = this.calculateResponseModel.find(x => x.productVariant === 1 && x.amountInsured === 62000);
    }
    this.travelStarOption = this.calculateResponseModel.find(x => x.productVariant === 2);

    this.initializeDates();
  }

  // <editor-fold desc="DATEPICKER">

  initializeDates() {
    const currentDate: Date = new Date(new Date().toDateString());
    const maxValidDate: Date = new Date(currentDate.getTime() + 14 * 24 * 60 * 60 * 1000);

    // init days
    let daysOfMonth: number = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    if (currentDate.getMonth() === maxValidDate.getMonth()) {
      daysOfMonth = maxValidDate.getDate();
    }
    for (let i = currentDate.getDate(); i <= daysOfMonth; i++) {
      this.daysArray.push(i);
    }

    // init months
    if (currentDate.getMonth() !== maxValidDate.getMonth()) {
      this.monthsArray.push(currentDate.getMonth() + 1);
      this.monthsArray.push(maxValidDate.getMonth() + 1);
    } else {
      this.monthsArray.push(currentDate.getMonth() + 1);
    }

    // init years
    if (currentDate.getFullYear() !== maxValidDate.getFullYear()) {
      this.yearsArray.push(currentDate.getFullYear());
      this.yearsArray.push(maxValidDate.getFullYear());
    } else {
      this.yearsArray.push(currentDate.getFullYear());
    }

    this.insuranceDay = currentDate.getDate();
    this.insuranceMonth = currentDate.getMonth() + 1;
    this.insuranceYear = currentDate.getFullYear();
  }

  selectInsuranceDay(day: number) {
    this.insuranceDay = day;
    this.showDayDrop = false;
  }

  onClickOutsideDayCombo(event: Object) {
    if (event && event['value'] === true) {
      this.showDayDrop = false;
    }
  }

  selectInsuranceMonth(month: number) {
    this.insuranceMonth = month;
    this.showMonthDrop = false;
  }

  onClickOutsideMonthCombo(event: Object) {
    if (event && event['value'] === true) {
      this.showMonthDrop = false;
    }
  }

  selectInsuranceYear(year: number) {
    this.insuranceYear = year;
    this.showYearDrop = false;
  }

  onClickOutsideYearCombo(event: Object) {
    if (event && event['value'] === true) {
      this.showYearDrop = false;
    }
  }

    // </editor-fold>

  getPremiumForTravelStar() {
    const model: CalculationRequestModel = new CalculationRequestModel();
    model.tariff.insuranceBeginDate = this.calculationRequestModel.tariff.insuranceBeginDate;
    model.tariff.insuranceEndDate = this.calculationRequestModel.tariff.insuranceEndDate;
    model.tariff.fullYear = this.calculationRequestModel.tariff.fullYear;
    model.tariff.travelReason = this.calculationRequestModel.tariff.travelReason;
    model.tariff.insuranceCoverage = this.calculationRequestModel.tariff.insuranceCoverage;
    model.tariff.productVariant = 2;
    model.tariff.amountInsured = 120000;
    model.tariff.cancellationInsurance = this.cancellation;
    model.tariff.bookingDate = this.cancellation ?
      new Date(this.insuranceYear, this.insuranceMonth - 1, this.insuranceDay).toDateString() : null;

    this.webShopApiService.calculateTravelStarPremium(model)
      .subscribe(
        (response) => {
          this.travelStarOption = response;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  toggleTravel() {
    this.errorMessage = '';
    this.travel = !this.travel;
    this.travelStar = false;

    if (!this.travel) {
      this.insuredFirstSum = false;
      this.insuredSecondSum = false;
    } else {
      if (this.cancellation) {
        this.cancellation = false;
        this.getPremiumForTravelStar();
      }
    }
  }

  toggleTravelStar() {
    this.errorMessage = '';
    this.travelStar = !this.travelStar;
    this.travel = false;

    if (this.travelStar) {
      this.insuredFirstSum = false;
      this.insuredSecondSum = false;
    } else {
      if (this.cancellation) {
        this.cancellation = false;
        this.getPremiumForTravelStar();
      }
    }
  }

  toggleFirstInsuredSum() {
    this.errorMessage = '';
    this.insuredFirstSum = !this.insuredFirstSum;

    if (this.insuredFirstSum) {
      this.travel = true;
      this.travelStar = false;
      if (this.cancellation) {
        this.cancellation = false;
        this.getPremiumForTravelStar();
      }
    } else {
      if (!this.insuredSecondSum) {
        this.travel = false;
      }
    }
  }

  toggleSecondInsuredSum() {
    this.errorMessage = '';
    this.insuredSecondSum = !this.insuredSecondSum;

    if (this.insuredSecondSum) {
      this.travel = true;
      this.travelStar = false;
      if (this.cancellation) {
        this.cancellation = false;
        this.getPremiumForTravelStar();
      }
    } else {
      if (!this.insuredFirstSum) {
        this.travel = false;
      }
    }
  }

  toggleCancellation() {
    this.errorMessage = '';
    this.cancellation = !this.cancellation;

    if (this.cancellation) {
      this.travel = false;
      this.insuredFirstSum = false;
      this.insuredSecondSum = false;
      this.travelStar = true;
    }

    this.getPremiumForTravelStar();
  }

  submitStep2() {
    if (!this.travel && !this.travelStar) {
      this.errorMessage = 'Morate izabrati jednu od osiguranih suma.';
      return;
    }

    if (this.travel && !this.insuredFirstSum && !this.insuredSecondSum) {
      this.errorMessage = 'Morate izabrati jednu od osiguranih suma.';
      return;
    }

    this.router.navigate(['step3'], { queryParams: { type: this.type}, queryParamsHandling: 'merge' });
  }

}
