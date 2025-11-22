import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {EndpointSettings} from '../../../_settings/endpoint.settings';
import {Observable} from 'rxjs/internal/Observable';
import {SwrlRequestModel} from '../../../shared/models/swrlRequest.model';
import {SWRLResponseModel} from '../../../shared/models/SWRLResponse.model';

@Injectable({
  providedIn: 'root'
})
export class SwrlService {

  constructor(private httpClient: HttpClient, private endpointSettings: EndpointSettings) {
  }

  getGlossary(ttlContent: string): Observable<string[]> {
    return this.httpClient.post<string[]>(this.endpointSettings.getOntologyGlossary(), ttlContent, {
      headers: {'Content-Type': 'text/turtle'}
    });
  }

  getRelations(ttlContent: string): Observable<string[]> {
    return this.httpClient.post<string[]>(this.endpointSettings.getRelations(), ttlContent, {
      headers: {'Content-Type': 'text/turtle'}
    });
  }

  applySWRLRule(payload: SwrlRequestModel): Observable<SWRLResponseModel> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    return this.httpClient.post<SWRLResponseModel>(
      this.endpointSettings.applySWRLRule(), payload, {headers}
    );
  }

}
