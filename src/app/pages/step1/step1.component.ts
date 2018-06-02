import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {EnumModel} from '../../models/enum.model';

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
  insurancePurpose: EnumModel = new EnumModel(null, '');
  purposeSource: EnumModel[] = [];
  purposeErrorMessage = '';

  insuranceBeginDate: string;
  insuranceEndDate: string;

  constructor(private router: Router) {
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
    this.initializeYears();
    this.initializeMonths();
    this.initializeDays();
  }

  refreshDatePicker() {
    // empty days and months array
    this.daysArray = [];
    this.monthsArray = [];

    // get minimum values of year, month and day
    const minYear: number = new Date(new Date().getTime() + 24 * 60 * 60 * 1000).getFullYear();
    const minMonth: number = new Date(new Date().getTime() + 24 * 60 * 60 * 1000).getMonth() + 1;
    const minDay: number = new Date(new Date().getTime() + 24 * 60 * 60 * 1000).getDate();

    let startDayOfMonth = 1;
    let startMonthOfYear = 1;

    // initialize started month
    if (this.insuranceYear === minYear) {
      startMonthOfYear = minMonth;
    }

    for (let i = startMonthOfYear; i <= 12; i++) {
      this.monthsArray.push(i);
    }

    if (this.monthsArray.indexOf(this.insuranceMonth) === -1) {
      this.insuranceMonth = this.monthsArray[0];
    }

    // get number of days of month
    const daysOfMonth: number = new Date(this.insuranceYear, this.insuranceMonth, 0).getDate();

    // initialize started day
    if (this.insuranceYear === minYear && this.insuranceMonth === minMonth) {
      startDayOfMonth = minDay;
    }

    for (let i = startDayOfMonth; i <= daysOfMonth; i++) {
      this.daysArray.push(i);
    }

    if (this.daysArray.indexOf(this.insuranceDay) === -1) {
      this.insuranceDay = this.daysArray[0];
    }
  }

  initializeYears() {
    const currentYear: number = new Date(new Date().getTime() + 24 * 60 * 60 * 1000).getFullYear();
    const nextYear: number = currentYear + 1;
    this.yearsArray.push(currentYear);
    this.yearsArray.push(nextYear);
    this.insuranceYear = new Date(new Date().getTime() + 24 * 60 * 60 * 1000).getFullYear();
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
    const startedMonth: number = new Date(new Date().getTime() + 24 * 60 * 60 * 1000).getMonth() + 1;
    for (let i = startedMonth; i <= 12; i++) {
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
    const startedDay: number = new Date(new Date().getTime() + 24 * 60 * 60 * 1000).getDate();
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
      endDate =  new Date(beginDate.getTime() + 365 * 24 * 60 * 60 * 1000);
      this.insuranceEndDate = endDate.toDateString();
      return notification + '' + endDate.getDate() + '.' + (endDate.getMonth() + 1) + '.' + endDate.getFullYear() + '.';
    }

    if (this.insuranceDuration.id) {
      switch (this.insuranceDuration.id) {
        case 1:
          endDate =  new Date(beginDate.getTime() + 4 * 24 * 60 * 60 * 1000);
          break;
        case 2:
          endDate =  new Date(beginDate.getTime() + 8 * 24 * 60 * 60 * 1000);
          break;
        case 3:
          endDate =  new Date(beginDate.getTime() + 17 * 24 * 60 * 60 * 1000);
          break;
        case 4:
          endDate =  new Date(beginDate.getTime() + 31 * 24 * 60 * 60 * 1000);
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

    this.router.navigate(['step2', this.insuranceBeginDate, this.insuranceEndDate, this.annualCoverage, this.insurancePurpose.id]);
  }
}
