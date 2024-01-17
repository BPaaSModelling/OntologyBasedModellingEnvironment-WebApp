import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

import {EndpointSettings} from '../../../_settings/endpoint.settings';
import {Observable} from 'rxjs/internal/Observable';
import {filter, tap} from 'rxjs/operators';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';

import {UserModel} from '../../../shared/models/User.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public idToken: string;
  public accessToken: string;
  public user: UserModel;

  constructor(private http: HttpClient,
              private router: Router,
              private endpointSettings: EndpointSettings) {
    this.handleAuthCallback();
  }


  public saveUser(user: UserModel): void {
    window.sessionStorage.removeItem(this.user.email);
    window.sessionStorage.setItem(this.user.email, JSON.stringify(user));
  }

  public getUser(): any {
    const user:string = window.sessionStorage.getItem(this.user.email);
    if (user) {
      return JSON.parse(user);
    }
    return {};
  }

  public getUserData(): UserModel {
    return this.user;
  }


  public login() {
    window.sessionStorage.removeItem(this.accessToken);
    window.sessionStorage.removeItem(this.idToken);
    window.location.href = this.endpointSettings.getLogin();
  }
  public isLoggedIn(): boolean {
    const user: string = window.sessionStorage.getItem(this.user.email);
    if (user) {
      return true;
    }
    return false;
  }

  public logout() {
    // Clear user data, tokens, etc.
    window.sessionStorage.removeItem(this.accessToken);
    window.sessionStorage.removeItem(this.idToken);
    window.location.href = this.endpointSettings.getLogout();
  }



  private handleAuthCallback(): void {
    // this.router.events.subscribe(event => {
    //   if(event instanceof NavigationEnd) {
    //     const url = new URL(window.location.href);
    //     const accessToken = url.searchParams.get('accessToken');
    //     const idToken = url.searchParams.get('idToken');
    //     if(accessToken && idToken) {
    //       localStorage.setItem('accessToken', accessToken);
    //       localStorage.setItem('idToken', idToken);
    //       //this.router.navigate(['/home']); // Adjust as per your route
    //     }
    //   }
    // })

  }

  public authenticate(): void {
    this.http.get<UserModel>(this.endpointSettings.getAuth(), { withCredentials: true })
      .subscribe(
        response => {
          // Check if the response contains the user data
          if (response) {
            this.user = response;
            this.saveUser(this.user);



            //this.router.navigate(['/home']);
          }
          //else {
          //  this.login();
          //}
        },
        error => {
          console.error('Authentication error', error);
          this.login();
        }
      );

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

  private validateTokens(accessToken: string, idToken: string): void {
    const params = new HttpParams()
      .set('accessToken', accessToken)
      .set('idToken', idToken);

    this.http.get<UserModel>(this.endpointSettings.getAuth(), { params: params, withCredentials: true })
    // Provide tokens as parameters in URL

    this.http.get<UserModel>(this.endpointSettings.getAuth(), { params: params})
      .subscribe(
        response => {
          // Check if the response contains the tokens
          if (response) {
            this.user = response;
            // Redirect to a protected route
            this.router.url //navigate(['/home']);
          } else {
            // If tokens are not received, redirect to login page
            this.login();
          }
        },
        error => {
          console.error('Authentication error', error);
          // Redirect to login page in case of error
          this.login();
        }
      );

  }

  clean(): void {
    window.sessionStorage.clear();
  }


}
