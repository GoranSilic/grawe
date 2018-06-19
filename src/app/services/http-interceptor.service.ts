import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpHeaders, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {environment} from '../../environments/environment';

@Injectable()
export class HttpInterceptorService {

  constructor() {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // clone the request to add the new header.
    const authReq = req.clone({headers: req.headers.set('Content-type', 'application/json')});

    // pass on the cloned request instead of the original request.
    return next.handle(authReq);
  }
}
