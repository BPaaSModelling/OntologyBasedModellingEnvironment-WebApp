import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {EndpointSettings} from '../../../_settings/endpoint.settings';
import {Observable} from 'rxjs/internal/Observable';
import {tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public username: string;
  public password: string;
  public loginUrl: string;

  constructor(private http: HttpClient, private endpointSettings: EndpointSettings) { }

  public login() {

    this.http.get<string>(this.endpointSettings.getLogin()).subscribe(
      data => {
          this.loginUrl = data;
          console.log("LoginURL is: "+this.loginUrl);

          window.location.href = this.loginUrl;

    }, error => console.log(error));

  }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('jwt_token');
    // Here you can also add logic to check if the token is expired
    return token != null;
  }

}
