import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpRequestService} from './http-request.service';
import {CalculationRequestModel} from '../models/calculation-request.model';
import {OfferRequestModel} from '../models/offer-request.model';
import {PaymentRequestModel} from '../models/payment-request.model';

@Injectable()
export class WebShopApiService {

  private calculatePremiumsUrl = environment.apiUrl + 'WebShop/CalculatePremiums';
  private calculateTravelStarPremiumUrl = environment.apiUrl + 'WebShop/CalculateTravelStarPremium';
  private offerRequestUrl = environment.apiUrl + 'WebShop/OfferRequest';
  private proceedToPaymentUrl = environment.apiUrl + 'WebShop/ProceedToPayment';

  constructor(private http: HttpRequestService) {
  }

  calculatePremiums(model: CalculationRequestModel) {
    return this.http.post(this.calculatePremiumsUrl, model, false);
  }

  calculateTravelStarPremium(model: CalculationRequestModel) {
    return this.http.post(this.calculateTravelStarPremiumUrl, model, false);
  }

  offerRequest(model: OfferRequestModel) {
    return this.http.post(this.offerRequestUrl, model, false);
  }

  proceedToPayment(model: PaymentRequestModel) {
    return this.http.post(this.proceedToPaymentUrl, model, false);
  }

}
