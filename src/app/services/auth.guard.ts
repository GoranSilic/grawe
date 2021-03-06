import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {OfferRequestModel} from '../models/offer-request.model';
import {StorageHelperService} from './storage-helper.service';
import {SharedService} from './shared.service';

@Injectable()
export class AuthGuardStep3 implements CanActivate {

  constructor(private router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    return this.isAuthenticatedStep3()
      .then(
        (authenticated: boolean) => {
          if (authenticated) {
            return true;
          } else {
            this.router.navigate(['home']);
          }
        }
      );
  }

  isAuthenticatedStep3() {
    const promise = new Promise(
      (resolve, reject) => {
        resolve(this.getDataForStep3());
      }
    );
    return promise;
  }

  getDataForStep3() {
    const offerModel: OfferRequestModel = StorageHelperService.GetData('OfferRequestModel');
    return offerModel && offerModel.tariff && offerModel.tariff.insuranceBeginDate ? offerModel.tariff : null;
  }
}

@Injectable()
export class AuthGuardStep4 implements CanActivate {

  constructor(private router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    return this.isAuthenticatedStep4()
      .then(
        (authenticated: boolean) => {
          if (authenticated) {
            return true;
          } else {
            this.router.navigate(['home']);
          }
        }
      );
  }

  isAuthenticatedStep4() {
    const promise = new Promise(
      (resolve, reject) => {
        resolve(this.getDataForStep4());
      }
    );
    return promise;
  }

  getDataForStep4() {
    const offerModel: OfferRequestModel = StorageHelperService.GetData('OfferRequestModel');
    return offerModel && offerModel.tariff && offerModel.customer.jmbg ? offerModel.customer : null;
  }
}


@Injectable()
export class AuthGuardSuccess implements CanActivate {

  constructor(private router: Router, private sharedService: SharedService) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

      if (this.sharedService.isAuthenticated()) {
        return true;
      } else {
        this.router.navigate(['home']);
      }
  }
}
