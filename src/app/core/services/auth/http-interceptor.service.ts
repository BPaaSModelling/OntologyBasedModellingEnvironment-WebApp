import {Inject, Injectable} from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,

} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthHttpInterceptor, AuthService, User} from '@auth0/auth0-angular';
import {from} from 'rxjs/internal/observable/from';
import {catchError, switchMap} from 'rxjs/operators';

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
      switchMap(accessToken =>
        from(this.authService.user$).pipe(
          switchMap(user => {
            if (accessToken && user) {
              const clonedRequest = req.clone({
                headers: req.headers
                  .set('Authorization', `Bearer ${accessToken}`)
                  .set('X-User-Email', user.email)
              });

              console.log("Header of the user: ", clonedRequest.headers.get('X-User-Email'));

              return next.handle(clonedRequest);
            }
            return next.handle(req);
          }),
          catchError(err => {
            // Handle errors if any
            console.error('Error fetching user', err);
            return next.handle(req);
          })
        )
      ),
      catchError(err => {
        // Handle errors if any
        console.error('Error fetching accessToken', err);
        return next.handle(req);
      })
    );
  }
}
