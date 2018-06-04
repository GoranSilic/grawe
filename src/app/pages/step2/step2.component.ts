import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
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

  type: string;
  insuredFirstSum = false;
  insuredSecondSum = false;

  calculateResponseModel: CalculationResponseModel[] = [];
  firstTravelOption: CalculationResponseModel = new CalculationResponseModel();
  secondTravelOption: CalculationResponseModel = new CalculationResponseModel();
  travelStarOption: CalculationResponseModel = new CalculationResponseModel();

  constructor(private route: ActivatedRoute, private webShopApiService: WebShopApiService) {
  }

  ngOnInit() {
    this.route.queryParams
      .filter(params => params.type)
      .subscribe(params => {
        this.type = params.type;
      });

    this.route.params.subscribe(
      (params: Params) => {
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

    // TEMPORARY
    for (let i = 1; i <= 31; i++) {
      this.daysArray.push(i);
    }
    for (let i = 1; i <= 12; i++) {
      this.monthsArray.push(i);
    }

    const currentYear: number = new Date().getFullYear();
    this.yearsArray.push(currentYear);
    this.yearsArray.push(currentYear + 1);
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
    this.travel = !this.travel;
    this.travelStar = false;

    if (!this.travel) {
      this.insuredFirstSum = false;
      this.insuredSecondSum = false;
    } else {
      this.cancellation = false;
    }
  }

  toggleTravelStar() {
    this.travelStar = !this.travelStar;
    this.travel = false;

    if (this.travelStar) {
      this.insuredFirstSum = false;
      this.insuredSecondSum = false;
    }
  }

  toggleFirstInsuredSum() {
    this.insuredFirstSum = !this.insuredFirstSum;

    if (this.insuredFirstSum) {
      this.travel = true;
      this.travelStar = false;
      this.cancellation = false;
    } else {
      if (!this.insuredSecondSum) {
        this.travel = false;
      }
    }
  }

  toggleSecondInsuredSum() {
    this.insuredSecondSum = !this.insuredSecondSum;

    if (this.insuredSecondSum) {
      this.travel = true;
      this.travelStar = false;
      this.cancellation = false;
    } else {
      if (!this.insuredFirstSum) {
        this.travel = false;
      }
    }
  }

  toggleCancellation() {
    this.cancellation = !this.cancellation;

    if (this.cancellation) {
      this.travel = false;
      this.insuredFirstSum = false;
      this.insuredSecondSum = false;
      this.travelStar = true;
    } else {
      this.travelStar = false;
    }
  }
}
