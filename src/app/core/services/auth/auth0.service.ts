import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams, HttpResponse} from '@angular/common/http';

import {EndpointSettings} from '../../../_settings/endpoint.settings';
import {Observable} from 'rxjs/internal/Observable';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';

import {UserModel} from '../../../shared/models/User.model';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';
import {ToastrService} from 'ngx-toastr';

import {AuthService} from '@auth0/auth0-angular';
import {DOCUMENT} from '@angular/common';
import {ModelingLanguageModel} from '../../../shared/models/ModelingLanguage.model';

/**
 * The AuthService class is responsible for managing authentication-related functionality.
 * It provides methods for user login, logout, and authentication checks.
 *
 * @constructor
 * @param {HttpClient} http - The HttpClient service used for making HTTP requests.
 * @param {Router} router - The Router service used for navigating between routes.
 * @param {EndpointSettings} endpointSettings - The EndpointSettings service used for retrieving endpoint URLs.
 */
@Injectable({
  providedIn: 'root'
})
export class Auth0Service {

  constructor(public auth: AuthService,
              @Inject(DOCUMENT) private doc: Document,
              private http: HttpClient,
              private router: Router,
              private endpointSettings: EndpointSettings,
              private toastr: ToastrService) {
    // this.currentUserSubject = new BehaviorSubject<UserModel>(this.getUser());
    // this.currentUser$ = this.currentUserSubject.asObservable();


  }

  public getUser(): UserModel | null {
    let user: UserModel;
    this.auth.user$.subscribe((profile) => {
        user = JSON.parse(JSON.stringify(profile, null, 2));
        console.log('Current User: ', user);
      }
    );
    return user as UserModel;
    // const user: string = window.sessionStorage.getItem('currentUser');
    // if (user) {
    //   return JSON.parse(user);
    // } else {
    //   console.log('No user found or currently logged in!');
    //   return null;
    // }
  }

  public loginCallback(): void {
    // Called when the user logs in
    this.auth.appState$.subscribe((appState) => {
      console.log("LoginCallback triggered: appState: ", appState);
      this.handleUserData();
    });
  }

  private handleUserData(): void {
    // Checks if user graph exists, if not creates it
    this.http.get(this.endpointSettings.getAuth()).subscribe(response => {
        if (response) {
          console.log('User Graph successfully created: ', response);
        } else {
          console.error('No user data received in the authentication response.');
        }
      },
      error => {
        if (error.status === 401) { // User is not logged in or token problem (expired, etc.)
          console.error('Authentication error', error);
          this.auth.loginWithRedirect();
        } else if (error.status === 403) { // Jena Fuseki is not running
          console.error('Jena Fuseki Server error', error);
          this.toastr.error(
            'Please make sure Jena Fuseki is running before logging in. <br/> Make sure all Turtle files are uploaded. <br/><br/>' + error.error,
            'Authentication error',
            {positionClass: 'toast-center-center', enableHtml: true});
          setTimeout(() => {
            // Called after 7 seconds to give time for the user to read the error message
            this.auth.loginWithRedirect();
          }, 7000);
        }

      });
    console.log('Initializing the graph data');
  }


  public isAuthenticated(): Observable<boolean> {
    console.log('isAuthenticated: ', this.auth.isAuthenticated$);
    return this.auth.isAuthenticated$;
  }

  public logout() {
    // Clear user data, tokens, etc.
    this.auth.logout({returnTo: this.doc.location.origin});
  }
}
