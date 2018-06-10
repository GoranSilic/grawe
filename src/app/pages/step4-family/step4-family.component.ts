import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import 'rxjs/add/operator/filter';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {InsuredPerson, OfferRequestModel} from '../../models/offer-request.model';
import {StorageHelperService} from '../../services/storage-helper.service';
import {JmbgHelper} from '../../helpers/jmbg.helper';
import {Toast, ToasterService} from 'angular5-toaster/dist';

@Component({
  selector: 'app-step4-family',
  templateUrl: './step4-family.component.html',
  styleUrls: ['./step4-family.component.less']
})
export class Step4FamilyComponent implements OnInit {
  type: string;
  jmbgError = '';
  insuredPersonsError = '';

  editMode = false;
  currentIndexEditPerson: number;

  insuredForm: FormGroup;
  insuredPerson: InsuredPerson = new InsuredPerson();
  offerRequestModel: OfferRequestModel;

  constructor(private route: ActivatedRoute, private router: Router, private fb: FormBuilder, private toasterService: ToasterService) {
    this.route.queryParams
      .filter(params => params.type)
      .subscribe(params => {
        this.type = params.type;
      });

    this.offerRequestModel = StorageHelperService.GetData('OfferRequestModel');
    if (!this.offerRequestModel) {
      this.router.navigate(['home']);
    }

    this.insuredForm = fb.group({
      'firstName': [null, Validators.compose([Validators.required, Validators.maxLength(50)])],
      'lastName': [null, Validators.compose([Validators.required, Validators.maxLength(50)])],
      'jmbg': [null, Validators.compose([Validators.required])],
      'passportNumber': [null, Validators.compose([Validators.required])]
    });
  }

  ngOnInit() {

  }

  showAddButton(): boolean {
    if (this.type === 'individual') {
      return this.offerRequestModel.insuredPersons.length === 0;
    } else if (this.type === 'family') {
      return this.offerRequestModel.insuredPersons.length < 7;
    }
  }

  isJmbgValid() {
    if (JmbgHelper.isJmbgValid(this.insuredPerson.jmbg)) {
      this.jmbgError = '';
      return true;
    } else {
      this.jmbgError = 'JMBG nije validan.';
      return false;
    }
  }

  showDateOfBirth() {
    if (this.insuredPerson.jmbg && this.insuredPerson.jmbg.toString().length === 13 &&
      JmbgHelper.isJmbgValid(this.insuredPerson.jmbg.toString())) {
      this.insuredPerson.dateOfBirth = JmbgHelper.formatDate(this.insuredPerson.jmbg);
    } else {
      this.insuredPerson.dateOfBirth = '-';
    }


    if (!JmbgHelper.validateNumbers(this.insuredPerson.jmbg) && !this.insuredForm.controls['jmbg'].hasError('required')) {
      this.jmbgError = 'JMBG mora da sadrži samo brojeve.';
      return;
    } else {
      this.jmbgError = '';
    }

    if (this.insuredPerson.jmbg && this.insuredPerson.jmbg.length !== 13 && !this.insuredForm.controls['jmbg'].hasError('required')) {
      this.jmbgError = 'JMBG mora da sadrži 13 karaktera.';
      return;
    } else {
      this.jmbgError = '';
    }
  }

  validateMaxPersons(): boolean {
    if (this.type === 'family') {
      let adults = 0;
      let children = 0;

      for (const person of this.offerRequestModel.insuredPersons) {
        const isAdult: boolean = JmbgHelper.isAdult(person.jmbg, new Date(this.offerRequestModel.tariff.insuranceBeginDate));
        if (isAdult) {
          adults++;
        } else {
          children++;
        }
      }

      const currentIsAdult: boolean = JmbgHelper.isAdult(this.insuredPerson.jmbg,
        new Date(this.offerRequestModel.tariff.insuranceBeginDate));
      if (currentIsAdult && adults >= 2) {
        const toast: Toast = {
          type: 'warning',
          title: 'Warning',
          body: 'Dostignut je maksimalan unos punoletnih lica',
          showCloseButton: true
        };

        this.toasterService.pop(toast);
        return false;
      }

      if (!currentIsAdult && children >= 5) {
        const toast: Toast = {
          type: 'warning',
          title: 'Warning',
          body: 'Dostignut je maksimalan unos maloletnih lica',
          showCloseButton: true
        };

        this.toasterService.pop(toast);
        return false;
      }
    }

    return true;
  }

  addInsuredPerson() {

    for (const c in this.insuredForm.controls) {
      this.insuredForm.controls[c].markAsTouched();
    }

    if (this.insuredForm.valid && this.insuredForm.controls['jmbg'].value.toString().length === 13 &&
      this.isJmbgValid() && this.validateMaxPersons()) {
      this.insuredPersonsError = '';

      this.insuredPerson.salutatoryAddress = JmbgHelper.getSalutatoryAddress(this.insuredPerson.jmbg);
      this.offerRequestModel.insuredPersons.push(this.insuredPerson);

      this.insuredPerson = new InsuredPerson();
      this.insuredForm.reset();

      StorageHelperService.PullData('OfferRequestModel');
      StorageHelperService.PushData('OfferRequestModel', this.offerRequestModel);
    }
  }

  editPerson(person: InsuredPerson, index: number) {
    this.editMode = true;
    this.insuredPerson = JSON.parse(JSON.stringify(person));
    this.currentIndexEditPerson = index;
  }

  editInsuredPerson() {
    for (const c in this.insuredForm.controls) {
      this.insuredForm.controls[c].markAsTouched();
    }

    if (this.insuredForm.valid && this.insuredForm.controls['jmbg'].value.toString().length === 13 &&
      this.isJmbgValid()) {
      this.editMode = false;
      const insuredPersonFromArray: InsuredPerson = this.offerRequestModel.insuredPersons[this.currentIndexEditPerson];
      insuredPersonFromArray.firstName = this.insuredPerson.firstName;
      insuredPersonFromArray.lastName = this.insuredPerson.lastName;
      insuredPersonFromArray.jmbg = this.insuredPerson.jmbg;
      insuredPersonFromArray.dateOfBirth = this.insuredPerson.dateOfBirth;
      insuredPersonFromArray.passportNumber = this.insuredPerson.passportNumber;
      insuredPersonFromArray.salutatoryAddress = JmbgHelper.getSalutatoryAddress(this.insuredPerson.jmbg);

      this.insuredPerson = new InsuredPerson();
      this.insuredForm.reset();

      StorageHelperService.PullData('OfferRequestModel');
      StorageHelperService.PushData('OfferRequestModel', this.offerRequestModel);
    }
  }

  deletePerson(person: InsuredPerson) {
    const index: number = this.offerRequestModel.insuredPersons.indexOf(person);
    this.offerRequestModel.insuredPersons.splice(index, 1);

    this.editMode = false;
    this.insuredPerson = new InsuredPerson();
    this.insuredForm.reset();

    StorageHelperService.PullData('OfferRequestModel');
    StorageHelperService.PushData('OfferRequestModel', this.offerRequestModel);
  }

  submitStep4InsuredPersons() {
    if (this.type === 'family' && this.offerRequestModel.insuredPersons.length < 2) {
      this.insuredPersonsError = 'Morate dodati najmanje dva osiguranika.';
      return;
    }

    if (this.type === 'individual' && this.offerRequestModel.insuredPersons.length === 0) {
      this.insuredPersonsError = 'Morate dodati najmanje jednog osiguranika.';
      return;
    }

    StorageHelperService.PullData('OfferRequestModel');
    StorageHelperService.PushData('OfferRequestModel', this.offerRequestModel);
    this.router.navigate(['step-details'], {queryParams: {type: this.type}, queryParamsHandling: 'merge'});
  }
}
