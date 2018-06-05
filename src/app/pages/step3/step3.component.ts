import {Component, HostListener, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import 'rxjs/add/operator/filter';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CustomValidators} from 'ng2-validation';
import {WebShopApiService} from '../../services/web-shop-api.service';
import {Customer} from '../../models/offer.model';

@Component({
  selector: 'app-step3',
  templateUrl: './step3.component.html',
  styleUrls: ['./step3.component.less']
})
export class Step3Component implements OnInit {
  insured = false;
  type: string;
  jmbgError = '';

  userForm: FormGroup;
  customer: Customer = new Customer();

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private router: Router,
              private webShopApiService: WebShopApiService) {
    this.userForm = fb.group({
      'firstName': [null, Validators.compose([Validators.required, Validators.maxLength(50)])],
      'lastName': [null, Validators.compose([Validators.required, Validators.maxLength(50)])],
      'uid': [null, Validators.compose([Validators.required])],
      'address': [null, Validators.compose([Validators.required, Validators.maxLength(50)])],
      'postalCode': [null, Validators.compose([Validators.required, Validators.maxLength(20)])],
      'city': [null, Validators.compose([Validators.required, Validators.maxLength(20)])],
      'phoneNumber': [null, Validators.compose([Validators.required, Validators.maxLength(20)])],
      'email': [null, Validators.compose([Validators.required, Validators.maxLength(50), CustomValidators.email])],
      'confirmedEmail': [null, Validators.compose([Validators.required, Validators.maxLength(50), CustomValidators.email])],
      'passportNumber': [null],
    });
  }

  @HostListener('keyup', ['$event'])
  inputChanged(event) {
    if (event.target.id === 'jmbg-input') {
      if ([69, 187, 188, 189, 190].includes(event.keyCode)) {
        event.preventDefault();
      }
    }
  }

  ngOnInit() {
    this.route.queryParams
      .filter(params => params.type)
      .subscribe(params => {
        this.type = params.type;
      });
  }

  togglePassportNumber() {
    this.insured = !this.insured;
    if (this.insured) {
      // this.userForm.addControl('passportNumber', new FormControl(Validators.compose([Validators.required, Validators.maxLength(20)])));
      this.userForm.controls['passportNumber'].setValidators(Validators.required);
    } else {
      // this.userForm.removeControl('passportNumber');
      this.userForm.controls['passportNumber'].clearValidators();
    }
    this.userForm.controls['passportNumber'].updateValueAndValidity();
  }

  isJmbgValid() {
    const day = this.customer.jmbg.toString().substring(0, 2);
    const month = this.customer.jmbg.toString().substring(2, 4);
    let year = this.customer.jmbg.toString().substring(4, 7);

    if (isNaN(+this.customer.jmbg)) {
      this.jmbgError = 'JMBG nije validan.';
      return false;
    }

    if (year.charAt(0) === '9') {
      year = '1' + year;
    } else if (year.charAt(0) === '0') {
      year = '2' + year;
    } else {
      this.jmbgError = 'JMBG nije validan.';
      return false;
    }

    if (+month > 12 || +month < 1) {
      this.jmbgError = 'JMBG nije validan.';
      return false;
    }

    const daysOfMonth: number = new Date(+year, +month, 0).getDate();

    if (+day < 1 || +day > daysOfMonth) {
      this.jmbgError = 'JMBG nije validan.';
      return false;
    }

    this.jmbgError = '';
    return true;
  }

  submitStep3(event) {
    event.stopPropagation();
    for (const c in this.userForm.controls) {
      this.userForm.controls[c].markAsTouched();
    }

    if (this.userForm.valid && this.userForm.controls['email'].value === this.userForm.controls['confirmedEmail'].value &&
    this.userForm.controls['uid'].value.toString().length === 13 && this.isJmbgValid()) {
      const route: string = this.type === 'individual' ? 'step4' : 'step4Family';
      this.router.navigate([route], { queryParams: { type: this.type}, queryParamsHandling: 'merge' });
    }
  }

}
