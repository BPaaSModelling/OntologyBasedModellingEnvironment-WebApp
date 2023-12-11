import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';



import {EndpointSettings} from '../../../_settings/endpoint.settings';
import {Observable} from 'rxjs/internal/Observable';
import {filter, tap} from 'rxjs/operators';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public username: string;
  public password: string;
  public loginUrl: string;

  constructor(private http: HttpClient,
              private router: Router,
              private endpointSettings: EndpointSettings) {
    this.handleAuthCallback();
  }

  public login() {
    window.location.href = this.endpointSettings.getLogin();
  }

  public logout() {

    // Clear user data, tokens, etc.
    localStorage.removeItem('accessToken');
    localStorage.removeItem('idToken');
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
    //       this.router.navigate(['/home']); // Adjust as per your route
    //     }
    //   }
    // })
  }

  public authenticate(): void {
    let accessToken = localStorage.getItem('accessToken');
    let idToken = localStorage.getItem('idToken');

    if (!accessToken || !idToken) {
      const url = new URL(window.location.href);
      accessToken = url.searchParams.get('accessToken');
      idToken = url.searchParams.get('idToken');
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('idToken', idToken);
      //this.login();
      //return;
    }

    const params = new HttpParams()
      .set('accessToken', accessToken)
      .set('idToken', idToken);

      this.http.get<any>(this.endpointSettings.getAuth(), { params: params})
        .subscribe(
          response => {
              // Check if the response contains the tokens
              //const accessToken = response.accessToken;
              const idToken = response;
              if (response) {

                  // Redirect to a protected route
                  this.router.navigate(['/home']);
              } else {
                  // If tokens are not received, redirect to login
                  this.login();
              }
          },
          error => {
              console.error('Authentication error', error);
              // Redirect to login in case of error
              this.login();
          }
      );
  }

  public decodeIdToken

}
