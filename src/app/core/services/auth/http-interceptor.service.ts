import { Injectable } from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS} from "@angular/common/http";
import { Observable} from "rxjs";
import { AuthService} from "../auth/auth.service";
import {UserModel} from "../../../shared/models/User.model";

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService) {
  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const userData: string = sessionStorage.getItem(this.authService.getUser());

    if (userData) {
      req = req.clone({
        withCredentials: true
      });
    }

    console.log("HttpInterceptor is working");

    return next.handle(req);
  }
}

export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true },
];
