import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpRequestService } from './http-request.service';
import { CalculationRequestModel } from '../models/calculation-request.model';
import { OfferRequestModel } from '../models/offer-request.model';
import { PaymentRequestModel } from '../models/payment-request.model';
import { StorageHelperService } from './storage-helper.service';

@Injectable()
export class WebShopApiService {
  private authOmvUserUrl = environment.apiUrl + 'Omvcards';
  private calculatePremiumsUrl =
    environment.apiUrl + 'WebShop/CalculatePremiums';
  private calculateTravelStarPremiumUrl =
    environment.apiUrl + 'WebShop/CalculateTravelStarPremium';
  private offerRequestUrl = environment.apiUrl + 'WebShop/OfferRequest';
  private proceedToPaymentUrl = environment.apiUrl + 'WebShop/ProceedToPayment';
  private downloadFileUrl = environment.apiUrl + 'WebShop/DownloadFile';

  constructor(private http: HttpRequestService) {}

  isOmvUser() {
    const omvAuth = StorageHelperService.GetData('OmvAuth');
    return omvAuth && omvAuth.id && omvAuth.cardId;
  }

  authOmvUser(id: string) {
    return this.http
      .get(`${this.authOmvUserUrl}/${id}`, false)
      .map(response => {
        StorageHelperService.PushData('OmvAuth', response);
        return response;
      });
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

  downloadFile(offerId: string, fileType: number) {
    return this.http.get(
      this.downloadFileUrl + '?offerId=' + offerId + '&fileType=' + fileType,
      false
    );
  }
}
