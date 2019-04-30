import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { WebShopApiService } from '../../services/web-shop-api.service';

@Component({
  selector: 'app-omv-step',
  templateUrl: './omv-step.component.html',
  styleUrls: ['./omv-step.component.less']
})
export class OmvStepComponent implements OnInit {
  loader = false;
  type: string;

  cardForm: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private webShopService: WebShopApiService
  ) {
    sessionStorage.clear();
    route.queryParams
      .filter(params => params.type)
      .subscribe(params => {
        this.type = params.type;
      });

    this.cardForm = fb.group({
      id: [null, Validators.compose([Validators.required])]
    });
  }

  ngOnInit() {}

  submitCodeForm(event) {
    event.stopPropagation();

    Object.keys(this.cardForm.controls).forEach(control =>
      this.cardForm.get(control).markAsTouched()
    );

    if (this.cardForm.invalid) {
      return;
    }

    this.loader = true;

    this.webShopService
      .authOmvUser(this.cardForm.controls['id'].value)
      .subscribe(
        response => {
          this.loader = false;
          console.log(response);
          this.router.navigate(['step1'], {
            queryParams: { type: this.type },
            queryParamsHandling: 'merge'
          });
        },
        error => {
          this.loader = false;
          console.log(error);
        }
      );
  }
}
