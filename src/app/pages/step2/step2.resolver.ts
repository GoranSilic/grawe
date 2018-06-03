import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {Injectable} from '@angular/core';
import {CalculationResponseModel} from '../../models/calculation-response.model';
import {WebShopApiService} from '../../services/web-shop-api.service';
import {CalculationRequestModel} from '../../models/calculation-request.model';


@Injectable()
export class Step2IndividualResolver implements Resolve<CalculationResponseModel> {

  constructor(private webShopApiService: WebShopApiService, private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): CalculationResponseModel |
    Observable<CalculationResponseModel> | Promise<CalculationResponseModel> {

    if (route.queryParams.type && route.params['insuranceBeginDate'] && route.params['insuranceEndDate']
      && route.params['fullYear'] && route.params['travelReason']) {
      const calculationRequest: CalculationRequestModel = new CalculationRequestModel();
      calculationRequest.tariff.insuranceBeginDate = route.params['insuranceBeginDate'];
      calculationRequest.tariff.insuranceEndDate = route.params['insuranceEndDate'];
      calculationRequest.tariff.fullYear = route.params['fullYear'];
      calculationRequest.tariff.travelReason = route.params['travelReason'];
      calculationRequest.tariff.productVariant = route.queryParams.type === 'individual' ? 1 : 2;

      return new CalculationResponseModel();
      // return this.webShopApiService.calculate(calculationRequest);
    } else {
      this.router.navigate(['home']);
    }
  }
}

@Injectable()
export class Step2FamilyResolver implements Resolve<CalculationResponseModel> {

  constructor(private webShopApiService: WebShopApiService, private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): CalculationResponseModel |
    Observable<CalculationResponseModel> | Promise<CalculationResponseModel> {

    if (route.queryParams.type && route.params['insuranceBeginDate'] && route.params['insuranceEndDate']
      && route.params['fullYear']) {
      const calculationRequest: CalculationRequestModel = new CalculationRequestModel();
      calculationRequest.tariff.insuranceBeginDate = route.params['insuranceBeginDate'];
      calculationRequest.tariff.insuranceEndDate = route.params['insuranceEndDate'];
      calculationRequest.tariff.fullYear = route.params['fullYear'];
      calculationRequest.tariff.productVariant = route.queryParams.type === 'individual' ? 1 : 2;

      return new CalculationResponseModel();
      // return this.webShopApiService.calculate(calculationRequest);
    } else {
      this.router.navigate(['home']);
    }
  }
}
