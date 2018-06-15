import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import 'rxjs/add/operator/filter';
import {PaymentResponseModel} from '../../models/payment-response.model';
import {SharedService} from '../../services/shared.service';
import {HttpRequestService} from '../../services/http-request.service';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-step5',
  templateUrl: './step5.component.html',
  styleUrls: ['./step5.component.less']
})
export class Step5Component implements OnInit {
  success: boolean; // change this to false to display declined policy message
  type: string;

  paymentResponse: PaymentResponseModel = new PaymentResponseModel();

  constructor(private route: ActivatedRoute, private router: Router, private sharedService: SharedService,
              private http: HttpRequestService) {
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

    this.http.downloadPdf(this.paymentResponse.offerId, '3');
      // .subscribe(
      //   (response) => {
      //     console.log(response);
      //     // const a = document.createElement('a');
      //     // document.body.appendChild(a);
      //     // a.setAttribute('style', 'display: none');
      //     // a.href = url;
      //     // a.download = 'Policy_' + this.paymentResponse.offerId;
      //     // a.click();
      //     // window.URL.revokeObjectURL(url);
      //     // a.remove();
      //   },
      //   (error) => {
      //
      //   }
      // );
  }
}
