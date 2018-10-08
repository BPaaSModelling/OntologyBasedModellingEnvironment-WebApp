import { Injectable } from '@angular/core';
import {Jsonp, Http, RequestOptions, Headers, URLSearchParams} from "@angular/http";
import {EndpointSettings} from "./_settings/endpoint.settings";
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/operator/delay';
import 'rxjs/operator/mergeMap';
import 'rxjs/operator/switchMap';
import {PaletteCategoryModel} from "./_models/PaletteCategory.model";
import {PaletteElementModel} from "./_models/PaletteElement.model";
import {QueryAnswerModel} from "./_models/QueryAnswer.model";
import {DatatypePropertyModel} from "./_models/DatatypeProperty.model";

@Injectable()
export class ModellerService {
  private options: RequestOptions;
  public paletteCategorie$: Observable<PaletteCategoryModel[]> = Observable.of([]);
  public paletteCategories: PaletteCategoryModel[] = [];
  public paletteElement$: Observable<PaletteElementModel[]> = Observable.of([]);
  public paletteElements: PaletteElementModel[] = [];
  public domainClasse$: Observable<QueryAnswerModel[]> = Observable.of([]);
  public domainClasses: QueryAnswerModel[] = [];
  public modelingLanguageClasse$: Observable<QueryAnswerModel[]> = Observable.of([]);
  public modelingLanguageClasses: QueryAnswerModel[] = [];
  public datatypeProperties$: Observable<DatatypePropertyModel[]> = Observable.of([]);
  public datatypeProperties: DatatypePropertyModel[] = [];
  public namespacePrefixe$: Observable<string[]> = Observable.of([]);
  public namespacePrefixes: string[] = [];
  public namespaceMap$: Observable<Map<string, string>> = Observable.of({});
  public namespaceMap: Map<string, string>;

  constructor(private http: Http, private jsonp: Jsonp) {
    const headers = new Headers({ 'Content-Type': 'application/json'});
    this.options = new RequestOptions({headers: headers });
  }

  queryPaletteElements(): void {
    this.http.get(EndpointSettings.getPaletteElementsEndpoint())
      .map(response => response.json()).subscribe(
      data => {
        //console.log('PaletteElements received: ' + JSON.stringify(data));
        this.paletteElement$ = Observable.of(data);
        this.paletteElements = data;
console.log(this.paletteElements);
      }, error => console.log('Could not query PaletteElements'));
  }

  queryPaletteCategories(): void {
    this.http.get(EndpointSettings.getPaletteCategoriesEndpoint())
      .map(response => response.json()).subscribe(
      data => {
        //console.log('PaletteCategories received: ' + JSON.stringify(data));
        this.paletteCategorie$ = Observable.of(data);
        this.paletteCategories = data;
      }, error => console.log('Could not query PaletteElements'));
  }

  createElementInOntology(oImg) {
    //console.log(JSON.stringify(oImg));
    let querySuccess: Boolean = false;
    let returnStr: string;
    console.log(oImg);
    return this.http.post(EndpointSettings.getCreateElementEndpoint(), oImg)
      .map(response => response.json());
  }

  deletePaletteElement(oImg): Boolean {
    //console.log(JSON.stringify(oImg));
    let querySuccess: Boolean = false;
    console.log(oImg);
    this.http.post(EndpointSettings.getDeletePaletteElementEndpoint(), oImg)
      .map(response => response.json()).subscribe(
      data => {
        querySuccess = (data == 'true');
      }
    );
    return querySuccess;
  }

  hidePaletteElement(oImg): Boolean {
    //console.log(JSON.stringify(oImg));
    let querySuccess: Boolean = false;
    console.log(oImg);
    this.http.post(EndpointSettings.getHidePaletteElementEndpoint(), oImg)
      .map(response => response.json()).subscribe(
      data => {
        querySuccess = (data == 'true');
      }
    );
    return querySuccess;
  }

  createDomainElementInOntology(oImg): Boolean {
    //console.log(JSON.stringify(oImg));
    let querySuccess: Boolean = false;
    console.log(oImg);
    this.http.post(EndpointSettings.getCreateDomainElementEndpoint(), oImg)
      .map(response => response.json()).subscribe(
      data => {
        querySuccess = (data == 'true');
      }
    );
    return querySuccess;
  }

  createNewDatatypeProperty(oImg): Boolean {
    //console.log(JSON.stringify(oImg));
    let querySuccess: Boolean = false;
    console.log(oImg);
    this.http.post(EndpointSettings.getCreateDatatypePropertyEndpoint(), oImg)
      .map(response => response.json()).subscribe(
      data => {
        querySuccess = (data === 'true');
      }
    );
    return querySuccess;
  }

  editElement(element: Object, modifiedElement: Object): Boolean {
    let querySuccess: Boolean = false;
    let params = new URLSearchParams();
    params.append('element', JSON.stringify(element));
    params.append('modifiedElement', JSON.stringify(modifiedElement)); //passing multiple parameters in POST
    console.log(element);
    this.http.post(EndpointSettings.getModifyElementEndpoint(), params)
      .map(response => response.json()).subscribe(
      data => {
        querySuccess = (data === 'true');
      }
    );
    return querySuccess;
  }

  editDatatypeProperty(property: Object, editedProperty: Object): Boolean {
    let querySuccess: Boolean = false;
    console.log(property);
    let params = new URLSearchParams();
    params.append('property', JSON.stringify(property));
    params.append('editedProperty', JSON.stringify(editedProperty)); //passing multiple parameters in POST
    this.http.post(EndpointSettings.getEditDatatypePropertyEndpoint(), params)
      .map(response => response.json()).subscribe(
      data => {
        querySuccess = (data === 'true');
      }
    );
    return querySuccess;
  }

  deleteDatatypeProperty(property: Object): Boolean {
    let querySuccess: Boolean = false;
    console.log(property);
    this.http.post(EndpointSettings.getDeleteDatatypePropertyEndpoint(), JSON.stringify(property))
      .map(response => response.json()).subscribe(
      data => {
        querySuccess = (data === 'true');
      }
    );
    return querySuccess;
  }

  createLanguageSubclasses(oImg): Boolean {
    //console.log(JSON.stringify(oImg));
    let querySuccess: Boolean = false;
    console.log(oImg);
    this.http.post(EndpointSettings.getCreateLanguageSubclassesEndpoint(), oImg)
      .map(response => response.json()).subscribe(
      data => {
        querySuccess = (data === 'true');
      }
    );
    return querySuccess;
  }

  queryDomainClasses(): void {


    this.http.get(EndpointSettings.getDomainClassesEndpoint())
      .map(response => response.json())
      .subscribe(data => {
        //console.log('PaletteElements received: ' + JSON.stringify(data));
        this.domainClasse$ = Observable.of(data);
        this.domainClasses = data;
      }, error => console.log('Could not query Domain Classes'));

  }

  queryModelingElementClasses(): void {
    this.http.get(EndpointSettings.getModelingElementClassesEndpoint())
      .map(response => response.json())
      .subscribe(data => {
        //console.log('PaletteElements received: ' + JSON.stringify(data));
        this.modelingLanguageClasse$ = Observable.of(data);
        this.modelingLanguageClasses = data;
      }, error => console.log('Could not query Modeling Language Classes'));
  }

  queryDatatypeProperties(domainName): void {
    this.http.get(EndpointSettings.getDatatypePropertyEndpoint(domainName))
      .map(response => response.json()).subscribe(
      data => {
        //console.log('PaletteCategories received: ' + JSON.stringify(data));
        this.datatypeProperties$ = Observable.of(data);
        this.datatypeProperties = data;
      }, error => console.log('Could not query DatatypeProperties'));
  }

  queryNamespacePrefixes(): void {
    this.http.get(EndpointSettings.getGetAllNamespacePrefixesEndpoint())
      .map(response => response.json()).subscribe(
      data => {
        //console.log('PaletteCategories received: ' + JSON.stringify(data));
        this.namespacePrefixe$ = Observable.of(data);
        this.namespacePrefixes = data;
      }, error => console.log('Could not query Namespace prefixes'));
  }

  queryNamespaceMap(): void {
    this.http.get(EndpointSettings.getNamespaceMapEndpoint())
      .map(response => response.json()).subscribe(
      data => {
        //console.log('PaletteCategories received: ' + JSON.stringify(data));
        this.namespaceMap$ = Observable.of(data);
        this.namespaceMap = data;
        console.log(this.namespaceMap);
      }, error => console.log('Could not query Namespace prefixes'));
  }
}
