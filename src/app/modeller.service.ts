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
import {DomainElementModel} from "./_models/DomainElement.model";
import {ModelingLanguageModel} from "./_models/ModelingLanguage.model";
import {Model} from './_models/Model.model';
import {ModelElementDetail} from './_models/ModelElementDetail.model';
import {toInteger} from '@ng-bootstrap/ng-bootstrap/util/util';
import { ArrowStructures } from "./_models/ArrowStructures.model";
import {InstantiationTargetType} from './_models/InstantiationTargetType.model';
import {RelationOptions} from './_models/RelationOptions.model';
import ModellingLanguageConstructInstance from './_models/ModellingLanguageConstructInstance.model';

@Injectable()
export class ModellerService {
  private options: RequestOptions;
  public modelingLanguage$: Observable<ModelingLanguageModel[]> = Observable.of([]);
  public paletteCategorie$: Observable<PaletteCategoryModel[]> = Observable.of([]);
  public paletteCategories: PaletteCategoryModel[] = [];
  public paletteElement$: Observable<PaletteElementModel[]> = Observable.of([]);
  public paletteElements: PaletteElementModel[] = [];
  public domainClasse$: Observable<DomainElementModel[]> = Observable.of([]);
  public domainClasses: DomainElementModel[] = [];
  public modelingLanguageClasse$: Observable<QueryAnswerModel[]> = Observable.of([]);
  public modelingLanguageClasses: QueryAnswerModel[] = [];
  public datatypeProperties$: Observable<DatatypePropertyModel[]> = Observable.of([]);
  public namespacePrefixe$: Observable<string[]> = Observable.of([]);
  public namespacePrefixes: string[] = [];
  public namespaceMap$: Observable<Map<string, string>> = Observable.of({});

  constructor(private http: Http, private jsonp: Jsonp) {
    const headers = new Headers({ 'Content-Type': 'application/json'});
    this.options = new RequestOptions({headers: headers });
  }

  queryModelingLanguages() {
    // Heroku difference
    return this.http.get(EndpointSettings.getModelingLanguagesEndpoint())
      .map(response => response.json())/*.subscribe(
      data => {
        //console.log('PaletteElements received: ' + JSON.stringify(data));
        this.modelingLanguage$ = Observable.of(data);
        console.log(this.modelingLanguage$);
      }, error => console.log('Could not query PaletteElements'));*/
  }

  queryModelingViews(langId) {
    return this.http.get(EndpointSettings.getModelingViewsEndpoint(langId))
      .map(response => response.json());
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

  queryPaletteCategories(viewId) {
    return this.http.get(EndpointSettings.getPaletteCategoriesEndpoint(viewId))
      .map(response => response.json());/*.subscribe(
      data => {
        //console.log('PaletteCategories received: ' + JSON.stringify(data));
        this.paletteCategorie$ = Observable.of(data);
        this.paletteCategories = data;
      }, error => console.log('Could not query PaletteElements'));*/
  }

  createElementInOntology(oImg) {
    //console.log(JSON.stringify(oImg));
    let querySuccess: Boolean = false;
    let returnStr: string;
    console.log(oImg);
    return this.http.post(EndpointSettings.getCreateElementEndpoint(), oImg)
      .map(response => response.json());
  }

  deletePaletteElement(oImg) {
    //console.log(JSON.stringify(oImg));
    let querySuccess: Boolean = false;
    console.log(oImg);
    return this.http.post(EndpointSettings.getDeletePaletteElementEndpoint(), oImg)
      .map(response => response.json()); //Do not subscribe here, subscribe where the method is called to make the call synchronous
    /*.subscribe(
      data => {
        querySuccess = (data == 'true');
      }
    );
    return querySuccess;*/
  }

  hidePaletteElement(oImg) {
    //console.log(JSON.stringify(oImg));
    let querySuccess: Boolean = false;
    console.log(oImg);
    return this.http.post(EndpointSettings.getHidePaletteElementEndpoint(), oImg)
      .map(response => response.json());/*.subscribe(
      data => {
        querySuccess = (data == 'true');
      }
    );
    return querySuccess;*/
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

  createNewDatatypeProperty(oImg) {
    //console.log(JSON.stringify(oImg));
    let querySuccess: Boolean = false;
    console.log(oImg);
    return this.http.post(EndpointSettings.getCreateDatatypePropertyEndpoint(), oImg)
      .map(response => response.json());
  }

  createNewBridgingConnector(oImg) {
    let querySuccess: Boolean = false;
    console.log(oImg);
    return this.http.post(EndpointSettings.getCreateBridgeConnectorEndpoint(), oImg)
      .map(response => response.json());
  }

  createNewSemanticMapping(oImg) {
    let querySuccess: Boolean = false;
    console.log(oImg);
    return this.http.post(EndpointSettings.getCreateSemanticMappingEndpoint(), oImg)
      .map(response => response.json());
  }

  editElement(element: Object, modifiedElement: Object) {
    let querySuccess: Boolean = false;
    let params = new URLSearchParams();
    params.append('element', JSON.stringify(element));
    params.append('modifiedElement', JSON.stringify(modifiedElement)); //passing multiple parameters in POST
    console.log(element);
    return this.http.post(EndpointSettings.getModifyElementEndpoint(), params)
      .map(response => response.json());
  }

  editDatatypeProperty(property: Object, editedProperty: Object) {
    let querySuccess: Boolean = false;
    console.log(property);
    let params = new URLSearchParams();
    params.append('property', JSON.stringify(property));
    params.append('editedProperty', JSON.stringify(editedProperty)); //passing multiple parameters in POST
    return this.http.post(EndpointSettings.getEditDatatypePropertyEndpoint(), params)
      .map(response => response.json());
  }

  editObjectProperty(property: Object, editedProperty: Object) {
    let querySuccess: Boolean = false;
    console.log(property);
    let params = new URLSearchParams();
    params.append('property', JSON.stringify(property));
    params.append('editedProperty', JSON.stringify(editedProperty)); //passing multiple parameters in POST
    return this.http.post(EndpointSettings.getEditObjectPropertyEndpoint(), params)
      .map(response => response.json());
  }

  deleteDatatypeProperty(property: Object) {
    let querySuccess: Boolean = false;
    console.log(property);
    return this.http.post(EndpointSettings.getDeleteDatatypePropertyEndpoint(), JSON.stringify(property))
      .map(response => response.json());
  }

  deleteObjectProperty(property: Object) {
    let querySuccess: Boolean = false;
    console.log(property);
    return this.http.post(EndpointSettings.getDeleteObjectPropertyEndpoint(), JSON.stringify(property))
      .map(response => response.json());
  }

  createLanguageSubclasses(oImg) {
    //console.log(JSON.stringify(oImg));
    let querySuccess: Boolean = false;
    console.log(oImg);
    return this.http.post(EndpointSettings.getCreateLanguageSubclassesEndpoint(), oImg)
      .map(response => response.json());
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

  queryDatatypeProperties(domainName) {
    return this.http.get(EndpointSettings.getDatatypePropertyEndpoint(domainName))
      .map(response => response.json());
  }

  queryBridgingConnectors(domainName) {
    return this.http.get(EndpointSettings.getBridgeConnectorEndpoint(domainName))
      .map(response => response.json());
  }

  querySemanticMappings(domainName) {
    return this.http.get(EndpointSettings.getSemanticMappingEndpoint(domainName))
      .map(response => response.json());
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

  queryNamespaceMap():Observable <Map<string, string>> {
    return this.http.get(EndpointSettings.getNamespaceMapEndpoint())
      .map(response => response.json());
  }

  /*queryDomainConcepts() {
    return this.http.get(EndpointSettings.getDomainConceptsEndpoint())
      .map(response => response.json());
  }*/

  getArrowStructures(): Promise<ArrowStructures> {
    return this.http.get(EndpointSettings.getArrowsEndpoint())
      .toPromise()
      .then(response => response.json() as ArrowStructures);
  }

  getModels(): Promise<Model[]> {
    return this.http.get(EndpointSettings.getModelsEndpoint())
      .toPromise()
      .then(response => response.json() as Model[]);
  }

  createModel(label: string): Promise<Model> {

    let dto: Model = new Model();
    dto.label = label;

    return this.http.post(EndpointSettings.getModelsEndpoint(), dto)
      .toPromise()
      .then(response => response.json() as Model);
  }

  createElement(modelId: string, shapeId: string, label: string, x: number, y: number, paletteConstruct: string, instantiationTargetType: InstantiationTargetType): Promise<ModelElementDetail> {
    let payload: Object = {
      x: toInteger(x),
      y: toInteger(y),
      paletteConstruct: paletteConstruct,
      uuid: shapeId,
      label,
      instantiationType: instantiationTargetType
    }

    return this.http.put(EndpointSettings.getElementEndpoint(modelId), payload)
      .toPromise()
      .then(response => response.json() as ModelElementDetail);
  }

  copyElement(existingElement: ModelElementDetail, modelId: string): Promise<ModelElementDetail> {
    let payload: Object = {
      paletteConstruct: existingElement.paletteConstruct,
      x: existingElement.x,
      y: existingElement.y,
      w: existingElement.width,
      h: existingElement.height,
      uuid: existingElement.id,
      label: existingElement.label,
      modelingLanguageConstructInstance: existingElement.modelingLanguageConstructInstance,
      note: existingElement.note,
      shapeRepresentsModel: existingElement.shapeRepresentsModel
    }

    return this.http.put(EndpointSettings.getElementEndpoint(modelId), payload)
      .toPromise()
      .then(response => response.json() as ModelElementDetail);
  }

  createConnection(modelId: string, shapeId: string, x: number, y: number, from: string, to: string, paletteConstruct: string, instantiationTargetType: InstantiationTargetType): Promise<ModelElementDetail> {
    let payload: Object = {
      x: toInteger(x),
      y: toInteger(y),
      paletteConstruct: paletteConstruct,
      uuid: shapeId,
      from: from,
      to: to,
      instantiationType: instantiationTargetType
    }

    return this.http.put(EndpointSettings.getConnectionEndpoint(modelId), payload)
      .toPromise()
      .then(response => response.json() as ModelElementDetail);
  }

  getElements(modelId: string): Promise<ModelElementDetail[]> {
    return this.http.get(EndpointSettings.getElementEndpoint(modelId))
      .toPromise()
      .then(response => response.json() as ModelElementDetail[])
  }

  updateElement(elementDetail: ModelElementDetail, modelId: string) {
    this.http.put(EndpointSettings.getElementDetailEndpoint(modelId, elementDetail.id), elementDetail)
      .toPromise()
      .then(response => console.log(response));
  }

  deleteElement(modelId: string, shapeId: string) {
    this.http.delete(EndpointSettings.getElementDetailEndpoint(modelId, shapeId))
      .toPromise()
      .then(response => console.log(response));
  }

  deleteModel(modelId: string): Promise<Object> {
    return this.http.delete(EndpointSettings.getModelEndpoint(modelId))
      .toPromise();
  }

  updateModel(model: Model) {
    this.http.put(EndpointSettings.getModelEndpoint(model.id), {
      id: model.id,
      label: model.label
    }).toPromise()
      .then(response => console.log(response));
  }

  getOptionsForRelation(relationId: string): Promise<RelationOptions> {
    return this.http.get(EndpointSettings.getRelationOptionsEndpoint(relationId))
      .toPromise()
      .then(response => response.json() as RelationOptions)
  }

  getInstancesOfConceptualElements(id: string): Promise<ModellingLanguageConstructInstance[]> {
    return this.http.post(EndpointSettings.getConceptualElementInstances(), {
      id: id
    })
      .toPromise()
      .then(response => response.json() as ModellingLanguageConstructInstance[])
  }
}
