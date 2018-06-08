import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import 'rxjs/add/operator/filter';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {InsuredPerson, OfferRequestModel} from '../../models/offer-request.model';
import {StorageHelperService} from '../../services/storage-helper.service';
import {JmbgHelper} from '../../helpers/jmbg.helper';

@Component({
  selector: 'app-step4-family',
  templateUrl: './step4-family.component.html',
  styleUrls: ['./step4-family.component.less']
})
export class Step4FamilyComponent implements OnInit {
  type: string;
  jmbgError = '';

  editMode = false;

  insuredForm: FormGroup;
  insuredPerson: InsuredPerson = new InsuredPerson();
  offerRequestModel: OfferRequestModel;

  constructor(private route: ActivatedRoute, private router: Router, private fb: FormBuilder) {
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
  }

  validateMaxPersons(): boolean {
    if (this.type === 'family') {
      let adults = 0;
      let children = 0;

      for (const person of this.offerRequestModel.insuredPersons) {
        const yearOld: number = JmbgHelper.getYearOfBirth(person.jmbg);
        if (yearOld >= 18) {
          adults++;
        } else {
          children++;
        }
      }
    }

    return true;
  }

  addInsuredPerson() {
    if (this.validateMaxPersons()) {

    }

    for (const c in this.insuredForm.controls) {
      this.insuredForm.controls[c].markAsTouched();
    }

    if (this.insuredForm.valid && this.insuredForm.controls['jmbg'].value.toString().length === 13 && this.isJmbgValid()) {
      this.insuredPerson.salutatoryAddress = JmbgHelper.getSalutatoryAddress(this.insuredPerson.jmbg);
      this.offerRequestModel.insuredPersons.push(this.insuredPerson);
      this.insuredPerson = new InsuredPerson();
      this.insuredForm.reset();
    }
  }

  editPerson(person: InsuredPerson) {

  }

  deletePerson(person: InsuredPerson) {
    const index: number = this.offerRequestModel.insuredPersons.indexOf(person);
    this.offerRequestModel.insuredPersons.splice(index, 1);
  }

  submitStep4InsuredPersons() {
    StorageHelperService.PullData('OfferRequestModel');
    StorageHelperService.PushData('OfferRequestModel', this.offerRequestModel);
    this.router.navigate(['step4-details'], {queryParams: {type: this.type}, queryParamsHandling: 'merge'});
  }
}
