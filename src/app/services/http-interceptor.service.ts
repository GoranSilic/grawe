import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpHeaders, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {environment} from '../../environments/environment';

@Injectable()
export class HttpInterceptorService {

  constructor() {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {


    if (req.url.indexOf(environment.graweApiUrl) > -1) {
      return next.handle(req);
      // const authHeader = 'Basic ' + btoa('5270000102:uR6Fnd7y');
      // const authReqq = req.clone(
      //   {headers: req.headers.set('Authorization', authHeader).set('Content-type', 'application/pdf').set('Accept', 'application/pdf'),
      //     responseType: 'blob', withCredentials: true});
      // return next.handle(authReqq);
    }

    // clone the request to add the new header.
    const authReq = req.clone({headers: req.headers.set('Content-type', 'application/json')});

    // pass on the cloned request instead of the original request.
    return next.handle(authReq);
  }
}
