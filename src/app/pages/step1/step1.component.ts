import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'app-step1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.less']
})
export class Step1Component implements OnInit {
  type: string;
  annualCoverage = false;
  showDayDrop = false;
  showMonthDrop = false;
  showYearDrop = false;
  showDurationDrop = false;
  showPurposeDrop = false;
  insuranceDay = 'DD';
  insuranceMonth = 'MM';
  insuranceYear = 'YYYY';
  insuranceDuration = '';
  insurancePurpose = '';

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams
      .filter(params => params.type)
      .subscribe(params => {
        this.type = params.type;
      });
  }

  toggleInsuranceDay() {
    this.showDayDrop = !this.showDayDrop;
    this.showDurationDrop = false;
    this.showPurposeDrop = false;
  }

  selectInsuranceDay(e) {
    this.insuranceDay = e.target.innerText;
    this.showDayDrop = false;
  }

  toggleInsuranceMonth() {
    this.showMonthDrop = !this.showMonthDrop;
    this.showDurationDrop = false;
    this.showPurposeDrop = false;
  }

  selectInsuranceMonth(e) {
    this.insuranceMonth = e.target.innerText;
    this.showMonthDrop = false;
  }

  toggleInsuranceYear() {
    this.showYearDrop = !this.showYearDrop;
    this.showDurationDrop = false;
    this.showPurposeDrop = false;
  }

  selectInsuranceYear(e) {
    this.insuranceYear = e.target.innerText;
    this.showYearDrop = false;
  }

  toggleInsuranceDuration() {
    this.showDurationDrop = !this.showDurationDrop;
    this.showDayDrop = false;
    this.showPurposeDrop = false;
  }

  selectInsuranceDuration(e) {
    this.insuranceDuration = e.target.innerText;
    this.showDurationDrop = false;
  }

  toggleInsurancePurpose() {
    this.showPurposeDrop = !this.showPurposeDrop;
    this.showDayDrop = false;
    this.showDurationDrop = false;
  }

  selectInsurancePurpose(e) {
    this.insurancePurpose = e.target.innerText;
    this.showPurposeDrop = false;
  }
}
