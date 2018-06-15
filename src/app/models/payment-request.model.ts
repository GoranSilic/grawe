import {PolicyRequestModel} from './policy-request.model';
import {OfferResponseModel} from './offer-response.model';

export class PaymentRequestModel {
  public policyRequest: PolicyRequestModel;
  public offerResponse: OfferResponseModel;

  constructor() {
    this.policyRequest = new PolicyRequestModel();
    this.offerResponse = new OfferResponseModel();
  }
}
