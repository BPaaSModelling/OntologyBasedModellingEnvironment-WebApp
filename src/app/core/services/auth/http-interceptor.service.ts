import {Inject, Injectable} from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,

} from "@angular/common/http";
import { Observable} from "rxjs";
import { Auth0Service} from '../auth/auth0.service';
import {AuthHttpInterceptor, AuthService} from '@auth0/auth0-angular';
import {UserModel} from "../../../shared/models/User.model";
import {from} from 'rxjs/internal/observable/from';
import {switchMap} from 'rxjs/operators';

/**
 * Class representing an HTTP interceptor service.
 * @implements {HttpInterceptor}
 * @classdesc This service is used to intercept HTTP requests and add authentication headers.
 * @injectable
 */
@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.authService.getAccessTokenSilently()).pipe(
      switchMap(token => {
        if (token) {
          const clonedRequest = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`)
          });
          return next.handle(clonedRequest);
        }
        return next.handle(req);
      })
    );
  }
}
