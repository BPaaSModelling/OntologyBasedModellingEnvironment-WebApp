import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';



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

  constructor(private http: HttpClient, private router: Router,private endpointSettings: EndpointSettings) { }

  public login() {
    window.location.href = this.endpointSettings.getLogin();
  }

  public authenticate(): void {

      this.http.get<any>(this.endpointSettings.getAuth()).subscribe(
          response => {
              // Check if the response contains the tokens
              const accessToken = response.accessToken;
              const idToken = response.idToken;
              if (accessToken && idToken) {
                  // Store the tokens
                  localStorage.setItem('accessToken', accessToken);
                  localStorage.setItem('idToken', idToken);

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

    private storeTokens(accessToken: string, idToken: string): void {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('idToken', idToken);
    }
}
