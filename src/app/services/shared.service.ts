import { Injectable } from '@angular/core';
import {PaymentResponseModel} from '../models/payment-response.model';

@Injectable()
export class SharedService {

  paymentResponse: PaymentResponseModel = new PaymentResponseModel();

  constructor() { }

  setPaymentResponse(paymentResponse: PaymentResponseModel) {
    this.paymentResponse.offerId = paymentResponse.offerId;
    this.paymentResponse.orderId = paymentResponse.orderId;
  }

  getPaymentResponse(): PaymentResponseModel {
    if (this.paymentResponse && this.paymentResponse.orderId && this.paymentResponse.offerId) {
      return this.paymentResponse;
    }

    return null;
  }

  isAuthenticated(): boolean {
    if (this.getPaymentResponse() !== null) {
      return true;
    }

    return false;
  }

  removeData() {
    this.paymentResponse.offerId = null;
    this.paymentResponse.orderId = null;
  }

}
