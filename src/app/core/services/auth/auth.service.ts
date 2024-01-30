import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams, HttpResponse} from '@angular/common/http';

import {EndpointSettings} from '../../../_settings/endpoint.settings';
import {Observable} from 'rxjs/internal/Observable';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';

import {UserModel} from '../../../shared/models/User.model';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';

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
export class AuthService {

  public idToken: string;
  public accessToken: string;
  private currentUserSubject: BehaviorSubject<UserModel>;
  public currentUser$: Observable<UserModel>;

  constructor(private http: HttpClient,
              private router: Router,
              private endpointSettings: EndpointSettings) {
    this.currentUserSubject = new BehaviorSubject<UserModel>(this.getUser());
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  public getUser(): UserModel | null {
    const user:string = window.sessionStorage.getItem('currentUser');
    if (user) {
      return JSON.parse(user);
    } else {
      console.log("No user found or currently logged in!");
      return null;
    }
  }

  // call this when user data change (login or logout)
  private refreshUser(): void {
    this.currentUserSubject.next(this.getUser());
  }

  public login() {
    window.sessionStorage.removeItem('currentUser');
    window.location.href = this.endpointSettings.getLogin();
  }
  public isLoggedIn(): boolean {
    const user: string = window.sessionStorage.getItem('currentUser');
    if (user) {
      return true;
    }
    return false;
  }

  public logout() {
    // Clear user data, tokens, etc.
    window.sessionStorage.removeItem('currentUser');
    window.location.href = this.endpointSettings.getLogout();
    this.clean();
  }

  public saveUser(user: UserModel): void {
    window.sessionStorage.removeItem('currentUser');
    window.sessionStorage.setItem('currentUser', JSON.stringify(user));
    this.refreshUser();
  }

  public authenticate() {
    return new Promise((resolve, reject) => {
      this.http.get<UserModel>(this.endpointSettings.getAuth(), {withCredentials: true})
        .subscribe(
          response => {
            // Check if the response contains the user data
            if (response) {
              //this.user = response;
              this.saveUser(response);
              resolve();
              //this.router.navigate(['/home']);
            } else {
              console.error("No user data received in the authentication response.");
              reject();
            }
          },
          error => {
            console.error('Authentication error', error);
            this.login();
            reject();
          });
    });
  }

  clean(): void {
    window.sessionStorage.clear();
  }
}
