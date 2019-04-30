import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { CalculationResponseModel } from '../../models/calculation-response.model';
import { WebShopApiService } from '../../services/web-shop-api.service';
import { CalculationRequestModel } from '../../models/calculation-request.model';
import { environment } from '../../../environments/environment';

@Injectable()
export class Step2Resolver implements Resolve<CalculationResponseModel> {
  constructor(
    private webShopApiService: WebShopApiService,
    private router: Router
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | any
    | CalculationResponseModel
    | Observable<CalculationResponseModel>
    | Promise<CalculationResponseModel> {
    if (
      route.queryParams.type &&
      route.params['insuranceBeginDate'] &&
      route.params['insuranceEndDate'] &&
      route.params['fullYear'] &&
      route.params['travelReason']
    ) {
      const calculationRequest: CalculationRequestModel = new CalculationRequestModel();
      calculationRequest.tariff.fullYear = route.params['fullYear'];
      calculationRequest.tariff.insuranceBeginDate =
        route.params['insuranceBeginDate'];
      calculationRequest.tariff.insuranceEndDate =
        route.params['insuranceEndDate'];
      calculationRequest.tariff.travelReason = route.params['travelReason'];
      calculationRequest.tariff.insuranceCoverage =
        route.queryParams.type === 'individual' ? 1 : 2;
      calculationRequest.tariff.discount = this.webShopApiService.isOmvUser()
        ? environment.omvDiscount
        : null;

      // return [];
      return this.webShopApiService.calculatePremiums(calculationRequest);
    } else {
      this.router.navigate(['home']);
    }
  }
}
