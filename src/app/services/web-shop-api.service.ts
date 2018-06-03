import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpRequestService} from './http-request.service';
import {CalculationRequestModel} from '../models/calculation-request.model';

@Injectable()
export class WebShopApiService {

  private calculatePremiumsUrl = environment.apiUrl + 'WebShop/CalculatePremiums';
  private calculateTravelStarPremiumUrl = environment.apiUrl + 'WebShop/CalculateTravelStarPremium';

  constructor(private http: HttpRequestService) {
  }

  calculatePremiums(model: CalculationRequestModel) {
    return this.http.post(this.calculatePremiumsUrl, model, false);
  }

  calculateTravelStarPremium(model: CalculationRequestModel) {
    return this.http.post(this.calculateTravelStarPremiumUrl, model, false);
  }

}
