import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-step1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.less']
})
export class Step1Component implements OnInit {
  annualCoverage = false;
  showDayDrop = false;
  showDurationDrop = false;
  showPurposeDrop = false;
  insuranceDay = 'DD';
  insuranceDuration = '';
  insurancePurpose = '';

  constructor() { }

  ngOnInit() {
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
