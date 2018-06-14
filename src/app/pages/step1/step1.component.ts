import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {EnumModel} from '../../models/enum.model';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'app-step1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.less']
})
export class Step1Component implements OnInit {
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

  // annual coverage checkbox
  annualCoverage = false;

  // duration combo
  showDurationDrop = false;
  disableDurationCombo = false;
  insuranceDuration: EnumModel = new EnumModel(null, '');
  durationSource: EnumModel[] = [];
  durationErrorMessage = '';

  // purpose combo
  showPurposeDrop = false;
  disablePurposeCombo = false;
  insurancePurpose: EnumModel = new EnumModel(null, '');
  purposeSource: EnumModel[] = [];
  purposeErrorMessage = '';

  type: string;
  loader = false;
  insuranceBeginDate: string;
  insuranceEndDate: string;

  constructor(private router: Router, private route: ActivatedRoute) {
    this.durationSource.push(new EnumModel(1, 'do 4 dana'));
    this.durationSource.push(new EnumModel(2, 'od 5 do 8 dana'));
    this.durationSource.push(new EnumModel(3, 'od 9 do 17 dana'));
    this.durationSource.push(new EnumModel(4, 'od 18 do 31 dana'));
    this.purposeSource.push(new EnumModel(1, 'Turističko'));
    this.purposeSource.push(new EnumModel(2, 'Poslovno'));
    this.purposeSource.push(new EnumModel(3, 'Studijsko'));
    this.purposeSource.push(new EnumModel(4, 'Privremeni rad u inostranstvu'));
  }

  ngOnInit() {
    sessionStorage.clear();
    this.route.queryParams
      .filter(params => params.type)
      .subscribe(params => {
        this.type = params.type;
        if (this.type === 'family') {
          this.disablePurposeCombo = true;
          this.insurancePurpose = new EnumModel(1, 'Turističko');
        }
      });
    this.initializeYears();
    this.initializeMonths();
    this.initializeDays();
  }

  refreshDatePicker() {
    // get minimum values of year, month and day
    const minYear: number = new Date(new Date().getTime() + 180 * 24 * 60 * 60 * 1000).getFullYear();
    const minMonth: number = new Date(new Date().getTime() + 180 * 24 * 60 * 60 * 1000).getMonth() + 1;
    const minDay: number = new Date(new Date().getTime() + 180 * 24 * 60 * 60 * 1000).getDate();

    // get maximum values of year, month and day
    const maxYear: number = new Date(new Date().getTime() + 360 * 24 * 60 * 60 * 1000).getFullYear();
    const maxMonth: number = new Date(new Date().getTime() + 360 * 24 * 60 * 60 * 1000).getMonth() + 1;
    const maxDay: number = new Date(new Date().getTime() + 360 * 24 * 60 * 60 * 1000).getDate();

    // if year is changed
    if (minYear !== maxYear && this.insuranceYear === maxYear) {
      this.daysArray = [];
      this.monthsArray = [];

      for (let i = 1; i <= maxMonth; i++) {
        this.monthsArray.push(i);
      }
      this.insuranceMonth = this.monthsArray.indexOf(this.insuranceMonth) > -1 ? this.insuranceMonth : this.monthsArray[0];

      let numberOfDays: number = new Date(this.insuranceYear, this.insuranceMonth, 0).getDate();
      if (this.insuranceMonth === maxMonth) {
        numberOfDays = maxDay;
      }
      for (let i = 1; i <= numberOfDays; i++) {
        this.daysArray.push(i);
      }
      this.insuranceDay = this.daysArray.indexOf(this.insuranceDay) > -1 ? this.insuranceDay : this.daysArray[0];

    } else if (minYear !== maxYear && this.insuranceYear === minYear) {
      this.daysArray = [];
      this.monthsArray = [];

      for (let i = minMonth; i <= 12; i++) {
        this.monthsArray.push(i);
      }
      this.insuranceMonth = this.monthsArray.indexOf(this.insuranceMonth) > -1 ? this.insuranceMonth : this.monthsArray[0];

      const numberOfDays: number = new Date(this.insuranceYear, this.insuranceMonth, 0).getDate();
      let startDay = 1;
      if (this.insuranceMonth === minMonth) {
        startDay = minDay;
      }

      for (let i = startDay; i <= numberOfDays; i++) {
        this.daysArray.push(i);
      }
      this.insuranceDay = this.daysArray.indexOf(this.insuranceDay) > -1 ? this.insuranceDay : this.daysArray[0];

    }

    // if month is changed
    if (minYear === maxYear) {
      this.daysArray = [];
      const numberOfDays: number = new Date(this.insuranceYear, this.insuranceMonth, 0).getDate();
      if (this.insuranceMonth === minMonth) {
        for (let i = minDay; i <= numberOfDays; i++) {
          this.daysArray.push(i);
        }
        this.insuranceDay = this.daysArray.indexOf(this.insuranceDay) > -1 ? this.insuranceDay : this.daysArray[0];
      } else if (this.insuranceMonth === maxMonth) {
        for (let i = 1; i <= maxDay; i++) {
          this.daysArray.push(i);
        }
        this.insuranceDay = this.daysArray.indexOf(this.insuranceDay) > -1 ? this.insuranceDay : this.daysArray[0];
      } else {
        for (let i = 1; i <= numberOfDays; i++) {
          this.daysArray.push(i);
        }
        this.insuranceDay = this.daysArray.indexOf(this.insuranceDay) > -1 ? this.insuranceDay : this.daysArray[0];
      }
    } else {
      if (this.insuranceYear === maxYear) {
        if (this.insuranceMonth === maxMonth) {
          this.daysArray = [];
          for (let i = 1; i <= maxDay; i++) {
            this.daysArray.push(i);
          }
          this.insuranceDay = this.daysArray.indexOf(this.insuranceDay) > -1 ? this.insuranceDay : this.daysArray[0];
        } else {
          this.daysArray = [];
          const numberOfDays: number = new Date(this.insuranceYear, this.insuranceMonth, 0).getDate();

          for (let i = 1; i <= numberOfDays; i++) {
            this.daysArray.push(i);
          }
          this.insuranceDay = this.daysArray.indexOf(this.insuranceDay) > -1 ? this.insuranceDay : this.daysArray[0];
        }
      } else {
        if (this.insuranceMonth === minMonth) {
          this.daysArray = [];
          const numberOfDays: number = new Date(this.insuranceYear, this.insuranceMonth, 0).getDate();

          for (let i = minDay; i <= numberOfDays; i++) {
            this.daysArray.push(i);
          }
          this.insuranceDay = this.daysArray.indexOf(this.insuranceDay) > -1 ? this.insuranceDay : this.daysArray[0];
        } else {
          this.daysArray = [];
          const numberOfDays: number = new Date(this.insuranceYear, this.insuranceMonth, 0).getDate();

          for (let i = 1; i <= numberOfDays; i++) {
            this.daysArray.push(i);
          }
          this.insuranceDay = this.daysArray.indexOf(this.insuranceDay) > -1 ? this.insuranceDay : this.daysArray[0];
        }
      }
    }
  }

  initializeYears() {
    const currentYear: number = new Date(new Date().getTime() + 180 * 24 * 60 * 60 * 1000).getFullYear();
    const maxYear: number = new Date(new Date().getTime() + 360 * 24 * 60 * 60 * 1000).getFullYear();
    this.yearsArray.push(currentYear);
    if (currentYear !== maxYear) {
      this.yearsArray.push(maxYear);
    }
    this.insuranceYear = new Date(new Date().getTime() + 180 * 24 * 60 * 60 * 1000).getFullYear();
  }

  onClickOutsideYearCombo(event: Object) {
    if (event && event['value'] === true) {
      this.showYearDrop = false;
    }
  }

  selectInsuranceYear(year: number) {
    this.insuranceYear = year;
    this.showYearDrop = false;
  }

  initializeMonths() {
    const startedMonth: number = new Date(new Date().getTime() + 180 * 24 * 60 * 60 * 1000).getMonth() + 1;
    let lastMonth = 12;
    const startDate: Date = new Date(new Date().getTime() + 180 * 24 * 60 * 60 * 1000);
    const maxDate: Date = new Date(new Date().getTime() + 360 * 24 * 60 * 60 * 1000);

    if (startDate.getFullYear() === maxDate.getFullYear()) {
      lastMonth = maxDate.getMonth() + 1;
    }
    for (let i = startedMonth; i <= lastMonth; i++) {
      this.monthsArray.push(i);
    }
    this.insuranceMonth = startedMonth;
  }

  onClickOutsideMonthCombo(event: Object) {
    if (event && event['value'] === true) {
      this.showMonthDrop = false;
    }
  }

  selectInsuranceMonth(month: number) {
    this.insuranceMonth = month;
    this.showMonthDrop = false;
  }

  initializeDays() {
    const daysOfMonth: number = new Date(this.insuranceYear, this.insuranceMonth, 0).getDate();
    const startedDay: number = new Date(new Date().getTime() + 180 * 24 * 60 * 60 * 1000).getDate();
    for (let i = startedDay; i <= daysOfMonth; i++) {
      this.daysArray.push(i);
    }
    this.insuranceDay = startedDay;
  }

  onClickOutsideDayCombo(event: Object) {
    if (event && event['value'] === true) {
      this.showDayDrop = false;
    }
  }

  selectInsuranceDay(day: number) {
    this.insuranceDay = day;
    this.showDayDrop = false;
  }

  selectInsuranceDuration(duration: EnumModel) {
    this.durationErrorMessage = '';
    this.insuranceDuration = duration;
    this.showDurationDrop = false;
  }

  onClickOutsideDurationCombo(event: Object) {
    if (event && event['value'] === true) {
      this.showDurationDrop = false;
    }
  }

  durationComboEvent() {
    if (!this.disableDurationCombo) {
      this.showDurationDrop = !this.showDurationDrop;
    }
  }

  purposeComboEvent() {
    if (this.type === 'individual') {
      this.showPurposeDrop = !this.showPurposeDrop;
    }
  }


  selectInsurancePurpose(purpose: EnumModel) {
    this.insurancePurpose = purpose;
    this.showPurposeDrop = false;
    this.purposeErrorMessage = '';
  }

  onClickOutsidePurposeCombo(event: Object) {
    if (event && event['value'] === true) {
      this.showPurposeDrop = false;
    }
  }

  annualCoverageEvent() {
    this.annualCoverage = !this.annualCoverage;
    this.disableDurationCombo = this.annualCoverage;
    this.durationErrorMessage = '';
    if (this.disableDurationCombo) {
      this.insuranceDuration = new EnumModel(null, '');
    }
  }

  calculateExpiryDate() {
    const notification = 'Vaše osiguranje ističe ';
    const beginDate: Date = new Date(this.insuranceYear, this.insuranceMonth - 1, this.insuranceDay);
    this.insuranceBeginDate = beginDate.toDateString();
    let endDate: Date = new Date();
    if (this.annualCoverage) {
      endDate = new Date(beginDate.getTime() + 364 * 24 * 60 * 60 * 1000);
      this.insuranceEndDate = endDate.toDateString();
      return notification + '' + endDate.getDate() + '.' + (endDate.getMonth() + 1) + '.' + endDate.getFullYear() + '.';
    }

    if (this.insuranceDuration.id) {
      switch (this.insuranceDuration.id) {
        case 1:
          endDate = new Date(beginDate.getTime() + 3 * 24 * 60 * 60 * 1000);
          break;
        case 2:
          endDate = new Date(beginDate.getTime() + 7 * 24 * 60 * 60 * 1000);
          break;
        case 3:
          endDate = new Date(beginDate.getTime() + 16 * 24 * 60 * 60 * 1000);
          break;
        case 4:
          endDate = new Date(beginDate.getTime() + 30 * 24 * 60 * 60 * 1000);
          break;
      }
      this.insuranceEndDate = endDate.toDateString();
      return notification + '' + endDate.getDate() + '.' + (endDate.getMonth() + 1) + '.' + endDate.getFullYear() + '.';
    }

    return null;
  }

  submitFirstStep() {
    if (!this.annualCoverage && !this.insuranceDuration.id) {
      this.durationErrorMessage = 'Morate izabrati trajanje osiguranja.';
      return;
    }

    if (!this.insurancePurpose.id) {
      this.purposeErrorMessage = 'Morate izabrati svrhu putovanja.';
      return;
    }

    this.loader = true;

    this.router.navigate(['step2', this.insuranceBeginDate, this.insuranceEndDate,
      this.annualCoverage, this.insurancePurpose.id], {queryParams: {type: this.type}, queryParamsHandling: 'merge'});
  }
}
