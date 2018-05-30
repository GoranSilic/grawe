import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import {Toast, ToasterService} from 'angular5-toaster/dist';

@Injectable()
export class HttpRequestService {

  constructor(private http: HttpClient, private toasterService: ToasterService) { }

  get(url: string, showSuccessToast?: boolean, toastMessage?: string) {
    const result = this.http.get(url)
      .map((response: Response) => {
        if (showSuccessToast) {
          const toast: Toast = {
            type: 'success',
            title: 'Well Done !',
            body: toastMessage ? toastMessage : 'Operation successful.',
            showCloseButton: true
          };

          this.toasterService.pop(toast);
        }

        return response;
      })
      .catch((response) => this.handleError(response));
    return result;
  }

  post(url: string, request: any, showSuccessToast?: boolean, toastMessage?: string) {
    const result = this.http.post(url, request)
      .map((response: Response) => {
        if (showSuccessToast) {
          const toast: Toast = {
            type: 'success',
            title: 'Well Done !',
            body: toastMessage ? toastMessage : 'Operation successful.',
            showCloseButton: true
          };

          this.toasterService.pop(toast);
        }
        return response;
      })
      .catch((response) => this.handleError(response));
    return result;
  }

  delete(url: string, showSuccessToast?: boolean, toastMessage?: string) {
    const result = this.http.delete(url)
      .map((response: Response) => {
        if (showSuccessToast) {
          const toast: Toast = {
            type: 'success',
            title: 'Well Done !',
            body: toastMessage ? toastMessage : 'Operation successful.',
            showCloseButton: true
          };

          this.toasterService.pop(toast);
        }
        if (response == null) {
          return null;
        }

        return response;
      })
      .catch((response) => this.handleError(response));
    return result;
  }

  put(url: string, request: any, showSuccessToast?: boolean, toastMessage?: string) {
    const result = this.http.put(url, request)
      .map((response: Response) => {
        if (showSuccessToast) {
          const toast: Toast = {
            type: 'success',
            title: 'Well Done !',
            body: toastMessage ? toastMessage : 'Operation successful.',
            showCloseButton: true
          };

          this.toasterService.pop(toast);
        }

        return response;
      })
      .catch((response) => this.handleError(response));
    return result;
  }

  handleError(error: any) {
    let errMsg: any;
    errMsg = error.error.message ? error.error.message : error.toString();

    console.log(errMsg);

    const toast: Toast = {
      type: 'error',
      title: 'Error !',
      body: errMsg,
      showCloseButton: true
    };

    this.toasterService.pop(toast);
    return Observable.throw(errMsg);
  }

}
