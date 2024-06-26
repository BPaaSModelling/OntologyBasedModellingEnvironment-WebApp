import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {EndpointSettings} from '../../../_settings/endpoint.settings';
import {Observable} from 'rxjs/internal/Observable';

import {ToastrService} from 'ngx-toastr';

import {AuthService} from '@auth0/auth0-angular';
import {DOCUMENT} from '@angular/common';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {of} from 'rxjs/internal/observable/of';

/** THIS SERVICE IS NOT USED IN THE CURRENT IMPLEMENTATION
 *
 * The AuthService class is responsible for managing authentication-related functionality.
 * It provides methods for user login, logout, and authentication checks.
 *
 * @constructor
 * @param {HttpClient} http - The HttpClient service used for making HTTP requests.
 * @param {EndpointSettings} endpointSettings - The EndpointSettings service used for retrieving endpoint URLs.
 */

@Injectable({
  providedIn: 'root'
})
export class Auth0Service {
/*
  constructor(public auth: AuthService,
              @Inject(DOCUMENT) private doc: Document,
              private http: HttpClient,
              private endpointSettings: EndpointSettings,
              private toastr: ToastrService) {
    // this.currentUserSubject = new BehaviorSubject<UserModel>(this.getUser());
    // this.currentUser$ = this.currentUserSubject.asObservable();
  }

  public loginCallback(): Observable<any> {
    // Called when the user logs in
    return this.auth.appState$.pipe(
      tap(appState => {
        console.log('Initializing the graph data in appState: ', appState);
      }),
      switchMap(() => this.handleUserData())
    );
  }


  private handleUserData(): Observable<any> {
    // Checks if user graph exists, if not creates it
    return this.http.get(this.endpointSettings.getAuth()).pipe(
      tap(response => {
        if (response) {
          console.log('User Graph successfully created: ', response);
          this.toastr.success(response.toString(),
            'Authentication',
            {positionClass: 'toast-center-center', enableHtml: true});
        } else {
          this.toastr.error('No user data received in the authentication response.',
            'Authentication error',
            {positionClass: 'toast-center-center'});
        }
      }),
      catchError(error => {
        if (error.status === 401) { // User is not logged in or token problem (expired, etc.)
          console.error('Authentication error', error);
          //this.auth.loginWithRedirect();
        } else if (error.status === 403) { // Jena Fuseki is not running
          console.error('Jena Fuseki Server error', error);
          this.toastr.error(
            `Please make sure Jena Fuseki is running before logging in. <br/> Make sure all Turtle files are uploaded. <br/><br/> ${error.error}`,
            'Authentication error',
            {positionClass: 'toast-center-center', enableHtml: true, tapToDismiss: true, closeButton: true});

        } else {
          console.error('Authentication error', error);
          this.toastr.error(
            `Please make sure Jena Fuseki is running before logging in. <br/> Ensure that all Turtle files are uploaded and default graph is not empty. <br/><br/> ${error}`,
            'Authentication error',
            {positionClass: 'toast-center-center', enableHtml: true, tapToDismiss: true, closeButton: true});
        }
        return of(null);
      }));
  }

  public logout() {
    // Clear user data, tokens, etc.
    this.auth.logout({returnTo: this.doc.location.origin});
  }
  */
}

