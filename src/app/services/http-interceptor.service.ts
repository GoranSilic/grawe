import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpHeaders, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class HttpInterceptorService {

  constructor() {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // get the auth header
    let authHeader = '';

    if (!authHeader) {
      authHeader = '';
    }

    // clone the request to add the new header.
    const authReq = req.clone({headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': authHeader
      })});

    // pass on the cloned request instead of the original request.
    return next.handle(authReq);
  }
}
