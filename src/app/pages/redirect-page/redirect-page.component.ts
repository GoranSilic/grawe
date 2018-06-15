import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SharedService} from '../../services/shared.service';
import {PaymentResponseModel} from '../../models/payment-response.model';

@Component({
  selector: 'app-redirect-page',
  templateUrl: './redirect-page.component.html',
  styleUrls: ['./redirect-page.component.less']
})
export class RedirectPageComponent implements OnInit {

  paymentResponse: PaymentResponseModel = new PaymentResponseModel();

  constructor(private route: ActivatedRoute, private router: Router, private sharedService: SharedService) {
    this.route.params
      .subscribe(params => {
          if (params['offerId'] && params['orderId']) {
            this.paymentResponse.offerId = params['offerId'];
            this.paymentResponse.orderId = params['orderId'];

            this.sharedService.setPaymentResponse(this.paymentResponse);

            this.router.navigate(['success-page']);
          } else {
            this.router.navigate(['home']);
          }
      });
  }

  ngOnInit() {
  }

}
