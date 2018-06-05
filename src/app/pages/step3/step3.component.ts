import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import 'rxjs/add/operator/filter';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CustomValidators} from 'ng2-validation';

@Component({
  selector: 'app-step3',
  templateUrl: './step3.component.html',
  styleUrls: ['./step3.component.less']
})
export class Step3Component implements OnInit {
  type: string;
  insured = false;

  userForm: FormGroup;

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

    });
  }

  ngOnInit() {
    this.route.queryParams
      .filter(params => params.type)
      .subscribe(params => {
        this.type = params.type;
      });
  }

  submitStep3(event) {
    event.stopPropagation();
    for (const c in this.userForm.controls) {
      this.userForm.controls[c].markAsTouched();
    }

    if (this.userForm.valid && this.userForm.controls['email'].value === this.userForm.controls['confirmedEmail'].value &&
    this.userForm.controls['uid'].value.length === 13) {
      const route: string = this.type === 'individual' ? 'step4' : 'step4Family';
      this.router.navigate([route], { queryParams: { type: this.type}, queryParamsHandling: 'merge' });
    }
  }

}
