import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest,} from '@angular/common/http';
import {AuthService} from '@auth0/auth0-angular';
import {Observable} from 'rxjs';
import {from} from 'rxjs/internal/observable/from';
import {catchError, finalize, switchMap, take} from 'rxjs/operators';
import {throwError} from 'rxjs/internal/observable/throwError';
import {LoadingService} from '../loading/loading.service';

/**
 * Class representing an HTTP interceptor service.
 * @implements {HttpInterceptor}
 * @classdesc This service is used to intercept HTTP requests and add authentication headers.
 * @injectable
 */
@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService, private loadingService: LoadingService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Pass all requests to /api endpoint without authentication
    // It is important to get env vars regardless of the auth state
    if (req.url.endsWith('/api')) {
      return next.handle(req);
    }
    // Check if the user is authenticated
    return this.authService.isAuthenticated$.pipe(
      take(1),
      switchMap(isAuthenticated => {
        if (isAuthenticated) {
          this.loadingService.setLoading(true);
          return this.addAccessTokenAndHeaders(req, next);
        } else {
          console.log('User is not authenticated');
          return next.handle(req);
        }
      }),
      catchError(err => {
        this.loadingService.setLoading(false);
        return throwError(() => new Error(`Error during authentication check: ${err.message}`));
      }),
      finalize(() => this.loadingService.setLoading(false))
    );
  }

  private addAccessTokenAndHeaders(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.authService.getAccessTokenSilently()).pipe(
      switchMap(accessToken =>
        this.authService.user$.pipe(
          take(1),
          switchMap(user => {
            if (accessToken && user) {
              const clonedRequest = req.clone({
                headers: req.headers
                  .set('Authorization', `Bearer ${accessToken}`)
                  .set('X-User-Email', user.email)
              });
              console.log(`HTTP request: ${req.url}, method: ${req.method}, User: ${clonedRequest.headers.get('X-User-Email')}`);
              return next.handle(clonedRequest);
            } else {
              return next.handle(req);
            }
          })
        )
      ),
      catchError(err => {
        return throwError(() => new Error(`Error fetching accessToken or user: ${err.message}`));
      })
    );
  }
}
