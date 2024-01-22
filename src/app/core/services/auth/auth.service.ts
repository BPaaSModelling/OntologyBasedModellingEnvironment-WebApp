import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams, HttpResponse} from '@angular/common/http';

import {EndpointSettings} from '../../../_settings/endpoint.settings';
import {Observable} from 'rxjs/internal/Observable';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';

import {UserModel} from '../../../shared/models/User.model';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';

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
    //window.sessionStorage.removeItem(this.accessToken);
    window.sessionStorage.removeItem('currentUser');
    window.location.href = this.endpointSettings.getLogout();
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

    /*// Check if tokens are already stored
    let accessToken = localStorage.getItem('accessToken');
    let idToken = localStorage.getItem('idToken');

    const url = new URL(window.location.href);
    // if tokens are passed as parameters than save them
    if (url.searchParams.has('accessToken') &&  url.searchParams.has('idToken')) {
      accessToken = url.searchParams.get('accessToken');
      idToken = url.searchParams.get('idToken');

      this.validateTokens(accessToken, idToken);
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('idToken', idToken);
    }

    if(!accessToken || !idToken || accessToken === "null" || idToken === "null") {
      this.login();
      return;
    }*/
  }

  // private validateTokens(accessToken: string, idToken: string): void {
  //   const params = new HttpParams()
  //     .set('accessToken', accessToken)
  //     .set('idToken', idToken);
  //
  //   this.http.get<UserModel>(this.endpointSettings.getAuth(), { params: params, withCredentials: true })
  //   // Provide tokens as parameters in URL
  //
  //   this.http.get<UserModel>(this.endpointSettings.getAuth(), { params: params})
  //     .subscribe(
  //       response => {
  //         // Check if the response contains the tokens
  //         if (response) {
  //           this.user = response;
  //           // Redirect to a protected route
  //           this.router.url //navigate(['/home']);
  //         } else {
  //           // If tokens are not received, redirect to login page
  //           this.login();
  //         }
  //       },
  //       error => {
  //         console.error('Authentication error', error);
  //         // Redirect to login page in case of error
  //         this.login();
  //       }
  //     );
  //
  // }

  clean(): void {
    window.sessionStorage.clear();
  }


}
