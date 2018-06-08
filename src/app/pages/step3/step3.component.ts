import {Component, HostListener, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import 'rxjs/add/operator/filter';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CustomValidators} from 'ng2-validation';
import {WebShopApiService} from '../../services/web-shop-api.service';
import {Customer, InsuredPerson, OfferRequestModel} from '../../models/offer-request.model';
import {StorageHelperService} from '../../services/storage-helper.service';
import {JmbgHelper} from '../../helpers/jmbg.helper';

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
  offerModel: OfferRequestModel = new OfferRequestModel();

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private router: Router) {
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

    this.offerModel = StorageHelperService.GetData('OfferRequestModel');
    if (!this.offerModel) {
      this.router.navigate(['home']);
    }
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
      this.userForm.controls['passportNumber'].setValidators(Validators.required);
    } else {
      this.userForm.controls['passportNumber'].clearValidators();
    }
    this.userForm.controls['passportNumber'].updateValueAndValidity();
  }

  isJmbgValid() {
    if (JmbgHelper.isJmbgValid(this.customer.jmbg)) {
      this.jmbgError = '';
      return true;
    } else {
      this.jmbgError = 'JMBG nije validan.';
      return false;
    }
  }

  submitStep3(event) {
    event.stopPropagation();
    for (const c in this.userForm.controls) {
      this.userForm.controls[c].markAsTouched();
    }

    if (this.userForm.valid && this.userForm.controls['email'].value === this.userForm.controls['confirmedEmail'].value &&
    this.userForm.controls['uid'].value.toString().length === 13 && this.isJmbgValid()) {

      this.customer.salutatoryAddress = JmbgHelper.getSalutatoryAddress(this.customer.jmbg);
      if (this.insured) {
        const insuredPerson: InsuredPerson = new InsuredPerson();
        insuredPerson.firstName = this.customer.firstName;
        insuredPerson.lastName = this.customer.lastName;
        insuredPerson.jmbg = this.customer.jmbg;
        insuredPerson.passportNumber = this.userForm.controls['passportNumber'].value;
        insuredPerson.salutatoryAddress = this.customer.salutatoryAddress;
        insuredPerson.dateOfBirth = JmbgHelper.formatDate(this.customer.jmbg);

        this.offerModel.insuredPersons = [];
        this.offerModel.insuredPersons.push(insuredPerson);
      }

      this.offerModel.customer = this.customer;
      StorageHelperService.PullData('OfferRequestModel');
      StorageHelperService.PushData('OfferRequestModel', this.offerModel);

      const route: string = this.type === 'individual' && this.insured ? 'step4-details' : 'step4-insured-persons';
      this.router.navigate([route], { queryParams: { type: this.type}, queryParamsHandling: 'merge' });
    }
  }

}
