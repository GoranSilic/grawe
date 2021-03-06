import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import { OfferRequestModel } from '../../models/offer-request.model';
import { StorageHelperService } from '../../services/storage-helper.service';
import { WebShopApiService } from '../../services/web-shop-api.service';
import { OfferResponseModel } from '../../models/offer-response.model';
import { PolicyRequestModel } from '../../models/policy-request.model';
import { PaymentRequestModel } from '../../models/payment-request.model';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpRequestService } from '../../services/http-request.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-step4',
  templateUrl: './step4.component.html',
  styleUrls: ['./step4.component.less']
})
export class Step4Component implements OnInit {
  terms = false;
  newsletter = false;
  info = false;
  loader = false;
  omvUser: boolean;

  step: number;
  type: string;
  duration: string;
  formError = '';

  paymentForm: SafeHtml;

  offerRequestModel: OfferRequestModel;
  offerResponseModel: OfferResponseModel = new OfferResponseModel();
  policyRequestModel: PolicyRequestModel = new PolicyRequestModel();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private webShopApiService: WebShopApiService,
    public sanitizer: DomSanitizer,
    private http: HttpRequestService
  ) {
    this.route.queryParams
      .filter(params => params.type)
      .subscribe(params => {
        this.type = params.type;
      });
    this.offerRequestModel = StorageHelperService.GetData('OfferRequestModel');
    if (!this.offerRequestModel) {
      this.router.navigate(['home']);
    }

    this.omvUser = this.webShopApiService.isOmvUser();

    this.getOfferId();

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

    const durationNumber: number = Math.ceil(
      (new Date(this.offerRequestModel.tariff.insuranceEndDate).getTime() -
        new Date(this.offerRequestModel.tariff.insuranceBeginDate).getTime()) /
        (1000 * 3600 * 24)
    );
    this.duration =
      durationNumber + 1 === 1
        ? durationNumber + 1 + ' dan'
        : durationNumber + 1 + ' dana';
  }

  ngOnInit() {}

  validateForm(): boolean {
    if (!this.terms) {
      this.formError =
        'Da biste nastavili sa kupovinom, potrebno je da prihvatite uslove osiguranja.';
      return false;
    }

    if (!this.info) {
      this.formError =
        'Da biste nastavili sa kupovinom, potrebno je da prihvatite informacije za ugovarača osiguranja.';
      return false;
    }

    return true;
  }

  getOfferId() {
    this.webShopApiService.offerRequest(this.offerRequestModel).subscribe(
      response => {
        this.offerResponseModel = response;
      },
      error => {
        console.log(error);
      }
    );
  }

  getTermsOfCondition() {
    const fileName: string =
      this.offerRequestModel.tariff.productVariant === 1
        ? 'Travel.pdf'
        : 'TravelStar.pdf';
    const fileUrl = environment.fileUrl + 'Uslovi/' + fileName;
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.setAttribute('style', 'display: none');
    a.setAttribute('target', '_blank');
    a.href = fileUrl;
    a.download = '';
    a.click();
    a.remove();
  }

  downloadInfoPdf() {
    this.loader = true;
    this.webShopApiService
      .downloadFile(this.offerResponseModel.offerId, 2)
      .subscribe(
        response => {
          const fileUrl =
            environment.fileUrl +
            this.offerResponseModel.offerId +
            '/Informacija_za_ugovaraca.pdf';
          const a = document.createElement('a');
          document.body.appendChild(a);
          a.setAttribute('style', 'display: none');
          a.setAttribute('target', '_blank');
          a.href = fileUrl;
          a.download = '';
          a.click();
          a.remove();
          this.loader = false;
        },
        error => {
          this.loader = false;
        }
      );

    // if (this.offerResponseModel.offerId) {
    //   this.http.downloadPdf(this.offerResponseModel.offerId, '2');
    // } else {
    //   this.webShopApiService.offerRequest(this.offerRequestModel)
    //     .subscribe(
    //       (response) => {
    //         this.offerResponseModel = response;
    //         this.http.downloadPdf(this.offerResponseModel.offerId, '2');
    //       },
    //       (error) => {
    //         console.log(error);
    //       }
    //     );
    // }
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
        this.webShopApiService.proceedToPayment(paymentRequestModel).subscribe(
          response => {
            if (response) {
              this.paymentForm = this.sanitizer.bypassSecurityTrustHtml(
                response
              );
              setTimeout(() => {
                document.getElementsByTagName('form')[0].submit();
              }, 100);
            } else {
              this.loader = false;
            }
          },
          error => {
            this.loader = false;
          }
        );
      }
    }
  }

  goToPreviousRoute() {
    window.history.back();
  }
}
