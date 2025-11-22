import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {EndpointSettings} from '../../../_settings/endpoint.settings';

export interface AiAskRequest {
  userMessage: string;
  swrlRule: string;
  ttlContent: string;
}

@Injectable({providedIn: 'root'})
export class AiService {
  constructor(private http: HttpClient, private endpointSettings: EndpointSettings) {
  }

  askOllama(body: AiAskRequest): Observable<string> {
    return this.http.post<string>(this.endpointSettings.askOllama(), body, {
      responseType: 'text' as 'json'
    });
  }
}
