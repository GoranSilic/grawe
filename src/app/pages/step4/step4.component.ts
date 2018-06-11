import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import 'rxjs/add/operator/filter';
import {OfferRequestModel} from '../../models/offer-request.model';
import {StorageHelperService} from '../../services/storage-helper.service';
import {WebShopApiService} from '../../services/web-shop-api.service';
import {OfferResponseModel} from '../../models/offer-response.model';
import {PolicyRequestModel} from '../../models/policy-request.model';
import {PaymentRequestModel} from '../../models/payment-request.model';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';

@Component({
  selector: 'app-step4',
  templateUrl: './step4.component.html',
  styleUrls: ['./step4.component.less']
})
export class Step4Component implements OnInit {
  step: number;
  terms = false;
  newsletter = false;
  info = false;
  type: string;
  duration: string;
  formError = '';
  loader = false;

  paymentForm: SafeHtml;

  offerRequestModel: OfferRequestModel;
  offerResponseModel: OfferResponseModel = new OfferResponseModel();
  policyRequestModel: PolicyRequestModel = new PolicyRequestModel();

  constructor(private route: ActivatedRoute, private router: Router, private webShopApiService: WebShopApiService,
              public sanitizer: DomSanitizer) {
    this.route.queryParams
      .filter(params => params.type)
      .subscribe(params => {
        this.type = params.type;
      });
    this.offerRequestModel = StorageHelperService.GetData('OfferRequestModel');
    if (!this.offerRequestModel) {
      this.router.navigate(['home']);
    }

    if (this.type === 'individual') {
      this.step = 4;

      for (const person of this.offerRequestModel.insuredPersons) {
        if (person.jmbg !== this.offerRequestModel.customer.jmbg) {
          this.step = 5;
        }
      }
    } else if (this.type === 'family') {
      this.step = 5;
    }

    const durationNumber: number = Math.ceil((new Date(this.offerRequestModel.tariff.insuranceEndDate).getTime() -
      new Date(this.offerRequestModel.tariff.insuranceBeginDate).getTime()) / (1000 * 3600 * 24));
    this.duration = durationNumber + 1 === 1 ? (durationNumber + 1) + ' dan' : (durationNumber + 1) + ' dana';
  }

  ngOnInit() {

  }

  validateForm(): boolean {
    if (!this.policyRequestModel.vkto) {
      this.formError = 'Morate uneti šifru zastupnika preporuke.';
      return false;
    }

    if (!this.terms) {
      this.formError = 'Morate prihvatiti uslove korišćenja.';
      return false;
    }

    if (!this.info) {
      this.formError = 'Morate štiklirati informacije za ugovarača osiguranja.';
      return false;
    }

    return true;
  }

  getOfferId() {
    this.webShopApiService.offerRequest(this.offerRequestModel)
      .subscribe(
        (response) => {
          this.offerResponseModel = response;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  proceedToPayment() {
    if (this.validateForm()) {
      this.policyRequestModel.conditionsAccepted = this.terms;
      this.policyRequestModel.newsletter = this.newsletter;
      this.policyRequestModel.preContractInfoAccepted = this.info;
      this.policyRequestModel.offerId = this.offerResponseModel.offerId;

      const paymentRequestModel: PaymentRequestModel = new PaymentRequestModel();
      paymentRequestModel.offerResponse = this.offerResponseModel;
      paymentRequestModel.policyRequest = this.policyRequestModel;

      if (paymentRequestModel.policyRequest.offerId) {
        this.loader = true;
        this.webShopApiService.proceedToPayment(paymentRequestModel)
          .subscribe(
            (response) => {
              if (response) {
                this.paymentForm = this.sanitizer.bypassSecurityTrustHtml(response);
                setTimeout(() => {
                  document.getElementsByTagName('form')[0].submit();
                }, 100);
              } else {
                this.loader = false;
              }
            },
            (error) => {
              this.loader = false;
            }
          );
      }
    }
  }
}
