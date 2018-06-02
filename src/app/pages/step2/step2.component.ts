import { Component, OnInit } from '@angular/core';
import {CalculationResponseModel} from '../../models/calculation-response.model';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-step2',
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.less']
})
export class Step2Component implements OnInit {
  travel = false;
  travelStar = false;
  insuredSum = false;
  bonus = false;
  cancellation = false;
  travelModal = false;
  travelStarModal = false;
  showDayDrop = false;
  showMonthDrop = false;
  showYearDrop = false;
  insuranceDay = 'DD';
  insuranceMonth = 'MM';
  insuranceYear = 'YYYY';

  calculateResponseModel: CalculationResponseModel = new CalculationResponseModel();

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.calculateResponseModel = this.route.snapshot.data.calculationResponseModel;
  }

  toggleInsuranceDay() {
    this.showDayDrop = !this.showDayDrop;
  }

  selectInsuranceDay(e) {
    this.insuranceDay = e.target.innerText;
    this.showDayDrop = false;
  }

  toggleInsuranceMonth() {
    this.showMonthDrop = !this.showMonthDrop;
  }

  selectInsuranceMonth(e) {
    this.insuranceMonth = e.target.innerText;
    this.showMonthDrop = false;
  }

  toggleInsuranceYear() {
    this.showYearDrop = !this.showYearDrop;
  }

  selectInsuranceYear(e) {
    this.insuranceYear = e.target.innerText;
    this.showYearDrop = false;
  }

  toggleTravel() {
    this.travel = !this.travel;
    this.travelStar = false;

    if (!this.travel) {
      this.insuredSum = false;
      this.bonus = false;
    } else {
      this.cancellation = false;
    }
  }

  toggleTravelStar() {
    this.travelStar = !this.travelStar;
    this.travel = false;

    if (this.travelStar) {
      this.insuredSum = false;
      this.bonus = false;
    }
  }

  toggleInsuredSum() {
    this.insuredSum = !this.insuredSum;

    if (this.insuredSum) {
      this.travel = true;
      this.travelStar = false;
      this.cancellation = false;
    } else {
      if (!this.bonus) {
        this.travel = false;
      }
    }
  }

  toggleBonus() {
    this.bonus = !this.bonus;

    if (this.bonus) {
      this.travel = true;
      this.travelStar = false;
      this.cancellation = false;
    } else {
      if (!this.insuredSum) {
        this.travel = false;
      }
    }
  }

  toggleCancellation() {
    this.cancellation = !this.cancellation;

    if (this.cancellation) {
      this.travel = false;
      this.insuredSum = false;
      this.bonus = false;
      this.travelStar = true;
    } else {
      this.travelStar = false;
    }
  }
}
