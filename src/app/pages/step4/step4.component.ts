import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import 'rxjs/add/operator/filter';
import {OfferRequestModel} from '../../models/offer-request.model';
import {StorageHelperService} from '../../services/storage-helper.service';
import {WebShopApiService} from '../../services/web-shop-api.service';
import {OfferResponseModel} from '../../models/offer-response.model';

@Component({
  selector: 'app-step4',
  templateUrl: './step4.component.html',
  styleUrls: ['./step4.component.less']
})
export class Step4Component implements OnInit {
  terms = false;
  newsletter = false;
  info = false;
  type: string;
  duration: string;

  offerRequestModel: OfferRequestModel;
  offerResponseModel: OfferResponseModel = new OfferResponseModel();

  constructor(private route: ActivatedRoute, private router: Router, private webShopApiService: WebShopApiService) {
    this.route.queryParams
      .filter(params => params.type)
      .subscribe(params => {
        this.type = params.type;
      });
    this.offerRequestModel = StorageHelperService.GetData('OfferRequestModel');
    if (!this.offerRequestModel) {
      this.router.navigate(['home']);
    }

    const durationNumber: number = Math.ceil((new Date(this.offerRequestModel.tariff.insuranceEndDate).getTime() -
      new Date(this.offerRequestModel.tariff.insuranceBeginDate).getTime()) / (1000 * 3600 * 24));
    this.duration = durationNumber + 1 === 1 ? (durationNumber + 1) + ' dan' : (durationNumber + 1) + ' dana';
  }

  ngOnInit() {

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
    this.router.navigate(['step5'], {queryParams: {type: this.type}, queryParamsHandling: 'merge'});
  }
}
