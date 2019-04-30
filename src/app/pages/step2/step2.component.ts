import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import { CalculationResponseModel } from '../../models/calculation-response.model';
import { WebShopApiService } from '../../services/web-shop-api.service';
import {
  CalculationRequestModel,
  Tariff
} from '../../models/calculation-request.model';
import { StorageHelperService } from '../../services/storage-helper.service';
import { OfferRequestModel } from '../../models/offer-request.model';
import { environment } from '../../../environments/environment';

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
  cancellationModal = false;
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

  constructor(
    private route: ActivatedRoute,
    private webShopApiService: WebShopApiService,
    private router: Router
  ) {}

  ngOnInit() {
    const offerRequestModel: OfferRequestModel = StorageHelperService.GetData(
      'OfferRequestModel'
    );

    this.route.queryParams
      .filter(params => params.type)
      .subscribe(params => {
        this.type = params.type;
        this.calculationRequestModel.tariff.insuranceCoverage =
          this.type === 'individual' ? 1 : 2;
      });

    this.route.params.subscribe((params: Params) => {
      this.calculationRequestModel.tariff.insuranceBeginDate =
        params['insuranceBeginDate'];
      this.calculationRequestModel.tariff.insuranceEndDate =
        params['insuranceEndDate'];
      this.calculationRequestModel.tariff.fullYear = params['fullYear'];
      this.calculationRequestModel.tariff.travelReason = params['travelReason'];

      const beginDate: string = params['insuranceBeginDate'];
      if (beginDate) {
        const dateOfTravel: Date = new Date(new Date(beginDate).toDateString());
        const currentDate: Date = new Date(new Date().toDateString());
        if (
          Math.ceil(
            (dateOfTravel.getTime() - currentDate.getTime()) /
              (1000 * 3600 * 24)
          ) >= 30
        ) {
          this.showCancellation = true;
        }
      }
    });

    this.calculateResponseModel = this.route.snapshot.data.calculationResponseModel;

    if (this.type === 'individual') {
      this.firstTravelOption = this.calculateResponseModel.find(
        x => x.productVariant === 1 && x.amountInsured === 12000
      );
      this.secondTravelOption = this.calculateResponseModel.find(
        x => x.productVariant === 1 && x.amountInsured === 32000
      );
    } else {
      this.firstTravelOption = this.calculateResponseModel.find(
        x => x.productVariant === 1 && x.amountInsured === 24000
      );
      this.secondTravelOption = this.calculateResponseModel.find(
        x => x.productVariant === 1 && x.amountInsured === 62000
      );
    }
    this.travelStarOption = this.calculateResponseModel.find(
      x => x.productVariant === 2
    );

    this.initializeDates();
    this.initFormOnBack(offerRequestModel);
  }

  initFormOnBack(offerRequestModel: OfferRequestModel) {
    if (offerRequestModel && offerRequestModel.tariff) {
      this.travel = offerRequestModel.tariff.productVariant === 1;
      this.travelStar = offerRequestModel.tariff.productVariant === 2;

      if (this.travel) {
        this.insuredFirstSum =
          offerRequestModel.tariff.amountInsured === 12000 ||
          offerRequestModel.tariff.amountInsured === 24000;
        this.insuredSecondSum =
          offerRequestModel.tariff.amountInsured === 32000 ||
          offerRequestModel.tariff.amountInsured === 62000;
      }

      this.cancellation = offerRequestModel.tariff.cancellationInsurance;
      if (this.cancellation) {
        this.insuranceDay = new Date(
          offerRequestModel.tariff.bookingDate
        ).getDate();
        this.insuranceMonth =
          new Date(offerRequestModel.tariff.bookingDate).getMonth() + 1;
        this.insuranceYear = new Date(
          offerRequestModel.tariff.bookingDate
        ).getFullYear();
        this.getPremiumForTravelStar();
      }
    }
  }

  // <editor-fold desc="DATEPICKER">

  initializeDates() {
    const currentDate: Date = new Date(
      new Date().getTime() - 13 * 24 * 60 * 60 * 1000
    );
    const maxValidDate: Date = new Date(
      currentDate.getTime() + 13 * 24 * 60 * 60 * 1000
    );

    // init days
    let daysOfMonth: number = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    ).getDate();
    if (currentDate.getMonth() === maxValidDate.getMonth()) {
      daysOfMonth = maxValidDate.getDate();
    }
    for (let i = currentDate.getDate(); i <= daysOfMonth; i++) {
      this.daysArray.push(i);
    }

    // init months
    if (currentDate.getMonth() !== maxValidDate.getMonth()) {
      this.monthsArray.push(currentDate.getMonth() + 1);
      if (currentDate.getFullYear() === maxValidDate.getFullYear()) {
        this.monthsArray.push(maxValidDate.getMonth() + 1);
      }
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

  refreshDatePicker() {
    const minDate: number = new Date(
      new Date().getTime() - 13 * 24 * 60 * 60 * 1000
    ).getTime();
    const maxDate: Date = new Date(minDate + 13 * 24 * 60 * 60 * 1000);

    // get minimum values of year, month and day
    const minYear: number = new Date(minDate).getFullYear();
    const minMonth: number = new Date(minDate).getMonth() + 1;
    const minDay: number = new Date(minDate).getDate();

    // set months and days
    if (
      minYear !== maxDate.getFullYear() &&
      this.insuranceYear === maxDate.getFullYear()
    ) {
      this.monthsArray = [];
      this.daysArray = [];
      this.monthsArray.push(1);
      this.insuranceMonth = 1;
      for (let i = 1; i <= maxDate.getDate(); i++) {
        this.daysArray.push(i);
      }
      this.insuranceDay =
        this.daysArray.indexOf(this.insuranceDay) > -1 ? this.insuranceDay : 1;
    } else if (
      minYear !== maxDate.getFullYear() &&
      this.insuranceYear === minYear
    ) {
      this.monthsArray = [];
      this.daysArray = [];
      this.monthsArray.push(12);
      this.insuranceMonth = 12;
      for (let i = minDay; i <= 31; i++) {
        this.daysArray.push(i);
      }
      this.insuranceDay =
        this.daysArray.indexOf(this.insuranceDay) > -1
          ? this.insuranceDay
          : minDay;
    }

    if (
      minMonth !== maxDate.getMonth() + 1 &&
      this.insuranceMonth === maxDate.getMonth() + 1
    ) {
      this.daysArray = [];
      for (let i = 1; i <= maxDate.getDate(); i++) {
        this.daysArray.push(i);
      }
      this.insuranceDay =
        this.daysArray.indexOf(this.insuranceDay) > -1 ? this.insuranceDay : 1;
    } else if (
      minMonth !== maxDate.getMonth() + 1 &&
      this.insuranceMonth === minMonth
    ) {
      this.daysArray = [];
      for (
        let i = minDay;
        i <= new Date(this.insuranceYear, this.insuranceMonth, 0).getDate();
        i++
      ) {
        this.daysArray.push(i);
      }
      this.insuranceDay =
        this.daysArray.indexOf(this.insuranceDay) > -1
          ? this.insuranceDay
          : minDay;
    }
  }

  selectInsuranceDay(day: number) {
    const oldValue: number = this.insuranceDay;
    this.insuranceDay = day;
    this.showDayDrop = false;
    if (oldValue !== this.insuranceDay) {
      this.getPremiumForTravelStar();
    }
  }

  onClickOutsideDayCombo(event: Object) {
    if (event && event['value'] === true) {
      this.showDayDrop = false;
    }
  }

  selectInsuranceMonth(month: number) {
    const oldValue: number = this.insuranceMonth;
    this.insuranceMonth = month;
    this.showMonthDrop = false;
    this.refreshDatePicker();
    if (oldValue !== this.insuranceMonth) {
      this.getPremiumForTravelStar();
    }
  }

  onClickOutsideMonthCombo(event: Object) {
    if (event && event['value'] === true) {
      this.showMonthDrop = false;
    }
  }

  selectInsuranceYear(year: number) {
    const oldValue: number = this.insuranceYear;
    this.insuranceYear = year;
    this.showYearDrop = false;
    this.refreshDatePicker();
    if (oldValue !== this.insuranceYear) {
      this.getPremiumForTravelStar();
    }
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
    model.tariff.bookingDate = this.cancellation
      ? new Date(
          this.insuranceYear,
          this.insuranceMonth - 1,
          this.insuranceDay
        ).toDateString()
      : null;
    model.tariff.discount = this.webShopApiService.isOmvUser()
      ? environment.omvDiscount
      : null;

    this.webShopApiService.calculateTravelStarPremium(model).subscribe(
      response => {
        this.travelStarOption = response;
      },
      error => {
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
    this.insuredSecondSum = false;
    this.insuredFirstSum = !this.insuredFirstSum;

    if (this.insuredFirstSum) {
      this.travel = true;
      this.travelStar = false;
      if (this.cancellation) {
        this.cancellation = false;
        this.getPremiumForTravelStar();
      }
    } else {
      this.travel = false;
    }
  }

  toggleSecondInsuredSum() {
    this.errorMessage = '';
    this.insuredFirstSum = false;
    this.insuredSecondSum = !this.insuredSecondSum;

    if (this.insuredSecondSum) {
      this.travel = true;
      this.travelStar = false;
      if (this.cancellation) {
        this.cancellation = false;
        this.getPremiumForTravelStar();
      }
    } else {
      this.travel = false;
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

    let offerModel: OfferRequestModel = StorageHelperService.PullData(
      'OfferRequestModel'
    );
    if (!offerModel) {
      offerModel = new OfferRequestModel();
    }
    offerModel.tariff = new Tariff();
    offerModel.tariff.insuranceCoverage = this.calculationRequestModel.tariff.insuranceCoverage;
    offerModel.tariff.insuranceBeginDate = this.calculationRequestModel.tariff.insuranceBeginDate;
    offerModel.tariff.insuranceEndDate = this.calculationRequestModel.tariff.insuranceEndDate;
    offerModel.tariff.fullYear = this.calculationRequestModel.tariff.fullYear;
    offerModel.tariff.travelReason = this.calculationRequestModel.tariff.travelReason;
    offerModel.tariff.productVariant = this.travel ? 1 : 2;
    offerModel.tariff.cancellationInsurance = this.cancellation;
    offerModel.tariff.bookingDate = this.cancellation
      ? new Date(
          this.insuranceYear,
          this.insuranceMonth - 1,
          this.insuranceDay
        ).toDateString()
      : null;
    offerModel.tariff.discount = this.webShopApiService.isOmvUser()
      ? environment.omvDiscount
      : 0;

    if (this.travel) {
      if (this.insuredFirstSum) {
        offerModel.tariff.amountInsured = this.firstTravelOption.amountInsured;
        offerModel.tariff.premiumRsd = this.firstTravelOption.premiumRsd;
        offerModel.tariff.premiumEur = this.firstTravelOption.premiumEur;
      } else if (this.insuredSecondSum) {
        offerModel.tariff.amountInsured = this.secondTravelOption.amountInsured;
        offerModel.tariff.premiumRsd = this.secondTravelOption.premiumRsd;
        offerModel.tariff.premiumEur = this.secondTravelOption.premiumEur;
      }
    } else if (this.travelStar) {
      offerModel.tariff.amountInsured = this.travelStarOption.amountInsured;
      offerModel.tariff.premiumRsd = this.travelStarOption.premiumRsd;
      offerModel.tariff.premiumEur = this.travelStarOption.premiumEur;
    }

    StorageHelperService.PushData('OfferRequestModel', offerModel);

    this.router.navigate(['step3'], {
      queryParams: { type: this.type },
      queryParamsHandling: 'merge'
    });
  }

  goToPreviousRoute() {
    window.history.back();
  }
}
