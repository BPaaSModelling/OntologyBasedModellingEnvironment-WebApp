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
    // Check if the user is authenticated,
    return this.authService.isAuthenticated$.pipe(
      switchMap(isAuthenticated => {
        if (isAuthenticated) {
          // Set the loading spinner
          this.loadingService.setLoading(true);
          return this.addAccessTokenAndHeaders(req, next).pipe(
            finalize(() => this.loadingService.setLoading(false)) // Reset loading state on completion or error
          );
        } else {
          console.log('User is not authenticated');

          return next.handle(req);
        }
      })
      );
    }


  private addAccessTokenAndHeaders(req: HttpRequest<any>, next: HttpHandler){
    return from(this.authService.getAccessTokenSilently()).pipe(
      switchMap(accessToken =>
        from(this.authService.user$).pipe(
          take(1),
          switchMap(user => {
            if (accessToken && user) {
              const clonedRequest = req.clone({
                headers: req.headers
                  .set('Authorization', `Bearer ${accessToken}`)
                  .set('X-User-Email', user.email)
              });
              console.log(`HTTP request: ${req.url}, method: ${req.method}, User: ${clonedRequest.headers.get('X-User-Email')}`);
              return next.handle(clonedRequest).pipe(
                finalize(() => this.loadingService.setLoading(false)) // Reset loading state on completion or error
              );
            }
            return next.handle(req).pipe(
              finalize(() => this.loadingService.setLoading(false)) // Reset loading state on completion or error
            );
          }),
          catchError(err => {
            return throwError('Error fetching user');
          })
        )
      ),
      catchError(err => {
        return throwError('Error fetching accessToken', err);
      })
    );
  }
}
