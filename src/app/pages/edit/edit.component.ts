import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.less']
})
export class EditComponent implements OnInit {
  insuranceDay: any;
  showDayDrop: any;
  insuranceMonth: any;
  showMonthDrop: any;
  insuranceYear: any;
  showYearDrop: any;
  annualCoverage: any;
  insuranceDuration: any;
  showDurationDrop: any;
  insurancePurpose: any;
  showPurposeDrop: any;
  travel: any;
  insuredSum: any;
  bonus: any;
  insured: any;
  toggleInsuranceDay: any;
  toggleInsuranceMonth: any;
  toggleInsuranceYear: any;
  toggleInsuranceDuration: any;
  toggleInsurancePurpose: any;
  toggleTravel: any;
  toggleInsuredSum: any;
  toggleBonus: any;


  constructor() { }

  ngOnInit() {
  }

}
