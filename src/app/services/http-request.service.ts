import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import {Toast, ToasterService} from 'angular5-toaster/dist';
import {environment} from '../../environments/environment';
import {Http, RequestOptions, Response, ResponseContentType, Headers, RequestMethod} from '@angular/http';

@Injectable()
export class HttpRequestService {

  constructor(private http: HttpClient, private toasterService: ToasterService, private httpOld: Http) { }

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

  downloadPdf(offerId: string, fileType: string) {
    const authHeader = 'Basic ' + btoa('5270000102:uR6Fnd7y');
    const url = environment.graweApiUrl + offerId + '/files/' + fileType;

    const headers = new Headers({'Authorization': authHeader, 'Content-Type': 'application/pdf', 'Accept': 'application/pdf'});
    const requestOptions: RequestOptions = new RequestOptions({headers: headers, responseType: ResponseContentType.Blob, method: RequestMethod.Get});

    return this.httpOld.get(url, requestOptions)
      .map((response: any) => {
        console.log(response);
        const fileBlob = response.blob();
        // const blob = new Blob([fileBlob], {type: 'application/pdf'});
        return fileBlob;
      })
      .subscribe(
        (data) => {
          const urlBlob = window.URL.createObjectURL(data);
          const a = document.createElement('a');
          document.body.appendChild(a);
          a.setAttribute('style', 'display: none');
          a.href = urlBlob;
          a.download = 'Policy_' + offerId;
          a.click();
          window.URL.revokeObjectURL(urlBlob);
          a.remove();
        },
        (error) => {
          console.log(error);
        },
        () => {
          console.log('Completed!');
        }
      );
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
    errMsg = error.error.error ? error.error.error : error.toString();

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
