import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpRequestService} from './http-request.service';

@Injectable()
export class WebShopApiService {

  private testApiUrl = environment.apiUrl + 'WebShop/TestMethod';

  constructor(private http: HttpRequestService) {
  }

  testMethod() {
    return this.http.get(this.testApiUrl, true, 'Test successful!');
  }

}
