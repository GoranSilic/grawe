import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpRequestService} from './http-request.service';
import {CalculationRequestModel} from '../models/calculation-request.model';

@Injectable()
export class WebShopApiService {

  private calculateUrl = environment.apiUrl + 'WebShop/Calculate';

  constructor(private http: HttpRequestService) {
  }

  calculate(model: CalculationRequestModel) {
    return this.http.post(this.calculateUrl, model, false);
  }

}
