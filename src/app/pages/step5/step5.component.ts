import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import 'rxjs/add/operator/filter';
import {PaymentResponseModel} from '../../models/payment-response.model';
import {SharedService} from '../../services/shared.service';
import {HttpRequestService} from '../../services/http-request.service';
import {environment} from '../../../environments/environment';
import {WebShopApiService} from '../../services/web-shop-api.service';

@Component({
  selector: 'app-step5',
  templateUrl: './step5.component.html',
  styleUrls: ['./step5.component.less']
})
export class Step5Component implements OnInit {
  success: boolean; // change this to false to display declined policy message
  type: string;
  loader: boolean;

  paymentResponse: PaymentResponseModel = new PaymentResponseModel();

  constructor(private route: ActivatedRoute, private router: Router, private sharedService: SharedService,
              private http: HttpRequestService, private webShopApiService: WebShopApiService) {
    this.success = this.router.url.indexOf('success-page') > -1;

    if (this.success) {
      if (this.sharedService.isAuthenticated()) {
        this.paymentResponse = JSON.parse(JSON.stringify(this.sharedService.getPaymentResponse()));
        this.sharedService.removeData();
      } else {
        this.router.navigate(['home']);
      }
    }
  }

  ngOnInit() {
  }

  downloadPolicy() {
    this.loader = true;

    this.webShopApiService.downloadFile(this.paymentResponse.offerId, 3)
      .subscribe(
        (response) => {
          const fileUrl = environment.fileUrl + this.paymentResponse.offerId + '/Potvrda_o_pokricu.pdf';
          const a = document.createElement('a');
          document.body.appendChild(a);
          a.setAttribute('style', 'display: none');
          a.setAttribute('target', '_blank');
          a.href = fileUrl;
          a.click();
          a.remove();
          this.loader = false;
        },
        (error) => {
          this.loader = false;
        }
      );
  }
}
