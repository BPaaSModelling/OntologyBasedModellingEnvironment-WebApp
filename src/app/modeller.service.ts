import { Injectable } from '@angular/core';
import {Jsonp, Http, RequestOptions, Headers, URLSearchParams} from '@angular/http';
import {EndpointSettings} from './_settings/endpoint.settings';
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators';
import { of } from 'rxjs';
// import 'rxjs/operator/delay';
// import 'rxjs/operator/mergeMap';
// import 'rxjs/operator/switchMap';
import {PaletteCategoryModel} from './_models/PaletteCategory.model';
import {PaletteElementModel} from './_models/PaletteElement.model';
import {QueryAnswerModel} from './_models/QueryAnswer.model';
import {DatatypePropertyModel} from './_models/DatatypeProperty.model';
import {DomainElementModel} from './_models/DomainElement.model';
import {ModelingLanguageModel} from './_models/ModelingLanguage.model';
import {ObjectPropertyModel} from './_models/ObjectProperty.model';
import {Model} from './_models/Model.model';
import {ModelElementDetail} from './_models/ModelElementDetail.model';
import { ArrowStructures } from './_models/ArrowStructures.model';
import {InstantiationTargetType} from './_models/InstantiationTargetType.model';
import {RelationOptions} from './_models/RelationOptions.model';
import ModellingLanguageConstructInstance from './_models/ModellingLanguageConstructInstance.model';

@Injectable()
export class ModellerService {
  private options: RequestOptions;
  public modelingLanguage$: Observable<ModelingLanguageModel[]> = of([]);
  public paletteCategorie$: Observable<PaletteCategoryModel[]> = of([]);
  public paletteCategories: PaletteCategoryModel[] = [];
  public paletteElement$: Observable<PaletteElementModel[]> = of([]);
  public paletteElements: PaletteElementModel[] = [];
  public domainClasse$: Observable<DomainElementModel[]> = of([]);
  public domainClasses: DomainElementModel[] = [];
  public modelingLanguageClasse$: Observable<QueryAnswerModel[]> = of([]);
  public modelingLanguageClasses: QueryAnswerModel[] = [];
  public datatypeProperties$: Observable<DatatypePropertyModel[]> = of([]);
  public namespacePrefixe$: Observable<string[]> = of([]);
  public namespacePrefixes: string[] = [];
  // public namespaceMap$: Observable<Map<string, string>> = of({});

  constructor(private http: Http, private jsonp: Jsonp, private endpointSettings: EndpointSettings) {
    const headers = new Headers({ 'Content-Type': 'application/json'});
    this.options = new RequestOptions('{headers: headers }');
  }

  queryModelingLanguages() {
    return this.http.get(this.endpointSettings.getModelingLanguagesEndpoint())
      .pipe(map(response => response.json())); /*.subscribe(
      data => {
        //console.log('PaletteElements received: ' + JSON.stringify(data));
        //this.modelingLanguage$ = of(data);
        //console.log(this.modelingLanguage$);
      }, error => console.log('Could not query PaletteElements'));*/
  }

  queryModelingViews(langId) {
    return this.http.get(this.endpointSettings.getModelingViewsEndpoint(langId))
      .pipe(map(response => response.json()));
  }

  queryPaletteElements(): void {
    this.http.get(this.endpointSettings.getPaletteElementsEndpoint())
      .pipe(map(response => response.json())).subscribe(
      data => {
        // console.log('PaletteElements received: ' + JSON.stringify(data));
        this.paletteElement$ = of(data);
        this.paletteElements = data;
        console.log(this.paletteElements);
      }, error => console.log('Could not query PaletteElements'));
  }

  queryPaletteCategories(viewId) {
    return this.http.get(this.endpointSettings.getPaletteCategoriesEndpoint(viewId))
      .pipe(map(response => response.json())); /*.subscribe(
      data => {
        //console.log('PaletteCategories received: ' + JSON.stringify(data));
        this.paletteCategorie$ = Observable.of(data);
        this.paletteCategories = data;
      }, error => console.log('Could not query PaletteElements'));*/
  }

  createElementInOntology(oImg) {
    // console.log(JSON.stringify(oImg));
    const querySuccess: Boolean = false;
    let returnStr: string;
    console.log(oImg);
    return this.http.post(this.endpointSettings.getCreateElementEndpoint(), oImg)
      .pipe(map(response => response.json()));
  }

  deletePaletteElement(oImg) {
    // console.log(JSON.stringify(oImg));
    const querySuccess: Boolean = false;
    console.log(oImg);
    return this.http.post(this.endpointSettings.getDeletePaletteElementEndpoint(), oImg)
      .pipe(map(response => response.json())); // Do not subscribe here, subscribe where the method is called to make the call synchronous
    /*.subscribe(
      data => {
        querySuccess = (data == 'true');
      }
    );
    return querySuccess;*/
  }

  hidePaletteElement(oImg) {
    // console.log(JSON.stringify(oImg));
    const querySuccess: Boolean = false;
    console.log(oImg);
    return this.http.post(this.endpointSettings.getHidePaletteElementEndpoint(), oImg)
      .pipe(map(response => response.json())); /*.subscribe(
      data => {
        querySuccess = (data == 'true');
      }
    );
    return querySuccess;*/
  }

  createDomainElementInOntology(oImg): Boolean {
    // console.log(JSON.stringify(oImg));
    let querySuccess: Boolean = false;
    console.log(oImg);
    this.http.post(this.endpointSettings.getCreateDomainElementEndpoint(), oImg)
      .pipe(map(response => response.json())).subscribe(
      data => {
        querySuccess = (data == 'true');
      }
    );
    return querySuccess;
  }

  createNewDatatypeProperty(oImg) {
    // console.log(JSON.stringify(oImg));
    const querySuccess: Boolean = false;
    console.log(oImg);
    return this.http.post(this.endpointSettings.getCreateDatatypePropertyEndpoint(), oImg)
      .pipe(map(response => response.json()));
  }

  createNewBridgingConnector(oImg) {
    const querySuccess: Boolean = false;
    console.log(oImg);
    return this.http.post(this.endpointSettings.getCreateBridgeConnectorEndpoint(), oImg)
      .pipe(map(response => response.json()));
  }

  createNewSemanticMapping(oImg) {
    const querySuccess: Boolean = false;
    console.log(oImg);
    return this.http.post(this.endpointSettings.getCreateSemanticMappingEndpoint(), oImg)
      .pipe(map(response => response.json()));
  }

  editElement(element: PaletteElementModel, modifiedElement: PaletteElementModel) {
    const querySuccess: Boolean = false;
    const params = new URLSearchParams();
    params.append('element', JSON.stringify(element));
    params.append('modifiedElement', JSON.stringify(modifiedElement)); // passing multiple parameters in POST
    console.log(element);
    return this.http.post(this.endpointSettings.getModifyElementEndpoint(), params)
      .pipe(map(response => response.json()));
  }

  editDatatypeProperty(property: DatatypePropertyModel, editedProperty: DatatypePropertyModel) {
    const querySuccess: Boolean = false;
    console.log(property);
    const params = new URLSearchParams();
    params.append('property', JSON.stringify(property));
    params.append('editedProperty', JSON.stringify(editedProperty)); // passing multiple parameters in POST
    return this.http.post(this.endpointSettings.getEditDatatypePropertyEndpoint(), params)
      .pipe(map(response => response.json()));
  }

  editObjectProperty(property: ObjectPropertyModel, editedProperty: ObjectPropertyModel) {
    const querySuccess: Boolean = false;
    console.log(property);
    const params = new URLSearchParams();
    params.append('property', JSON.stringify(property));
    params.append('editedProperty', JSON.stringify(editedProperty)); // passing multiple parameters in POST
    return this.http.post(this.endpointSettings.getEditObjectPropertyEndpoint(), params)
      .pipe(map(response => response.json()));
  }

  deleteDatatypeProperty(property: DatatypePropertyModel) {
    const querySuccess: Boolean = false;
    console.log(property);
    return this.http.post(this.endpointSettings.getDeleteDatatypePropertyEndpoint(), JSON.stringify(property))
      .pipe(map(response => response.json()));
  }

  deleteObjectProperty(property: ObjectPropertyModel) {
    const querySuccess: Boolean = false;
    console.log(property);
    return this.http.post(this.endpointSettings.getDeleteObjectPropertyEndpoint(), JSON.stringify(property))
      .pipe(map(response => response.json()));
  }

  createLanguageSubclasses(oImg) {
    // console.log(JSON.stringify(oImg));
    const querySuccess: Boolean = false;
    console.log(oImg);
    return this.http.post(this.endpointSettings.getCreateLanguageSubclassesEndpoint(), oImg)
      .pipe(map(response => response.json()));
  }

  queryDomainClasses(): void {


    this.http.get(this.endpointSettings.getDomainClassesEndpoint())
      .pipe(map(response => response.json()))
      .subscribe(data => {
        // console.log('PaletteElements received: ' + JSON.stringify(data));
        this.domainClasse$ = of(data);
        this.domainClasses = data;
      }, error => console.log('Could not query Domain Classes'));

  }

  queryModelingElementClasses(): void {
    this.http.get(this.endpointSettings.getModelingElementClassesEndpoint())
      .pipe(map(response => response.json()))
      .subscribe(data => {
        // console.log('PaletteElements received: ' + JSON.stringify(data));
        this.modelingLanguageClasse$ = of(data);
        this.modelingLanguageClasses = data;
      }, error => console.log('Could not query Modeling Language Classes'));
  }

  queryDatatypeProperties(domainName) {
    return this.http.get(this.endpointSettings.getDatatypePropertyEndpoint(domainName))
      .pipe(map(response => response.json()));
  }

  queryBridgingConnectors(domainName) {
    return this.http.get(this.endpointSettings.getBridgeConnectorEndpoint(domainName))
      .pipe(map(response => response.json()));
  }

  querySemanticMappings(domainName) {
    return this.http.get(this.endpointSettings.getSemanticMappingEndpoint(domainName))
      .pipe(map(response => response.json()));
  }

  queryNamespacePrefixes(): void {
    this.http.get(this.endpointSettings.getGetAllNamespacePrefixesEndpoint())
      .pipe(map(response => response.json())).subscribe(
      data => {
        // console.log('PaletteCategories received: ' + JSON.stringify(data));
        this.namespacePrefixe$ = of(data);
        this.namespacePrefixes = data;
      }, error => console.log('Could not query Namespace prefixes'));
  }

  queryNamespaceMap(): Observable <Map<string, string>> {
    return this.http.get(this.endpointSettings.getNamespaceMapEndpoint())
      .pipe(map(response => response.json()));
  }

  /*queryDomainConcepts() {
    return this.http.get(this.endpointSettings.getDomainConceptsEndpoint())
      .map(response => response.json());
  }*/

  getArrowStructures(): Promise<ArrowStructures> {
    return this.http.get(this.endpointSettings.getArrowsEndpoint())
      .toPromise()
      .then(response => response.json() as ArrowStructures);
  }

  getModels(): Promise<Model[]> {
    return this.http.get(this.endpointSettings.getModelsEndpoint())
      .toPromise()
      .then(response => response.json() as Model[]);
  }

  createModel(label: string): Promise<Model> {

    const dto: Model = new Model();
    dto.label = label;

    return this.http.post(this.endpointSettings.getModelsEndpoint(), dto)
      .toPromise()
      .then(response => response.json() as Model);
  }

  createElement(modelId: string, shapeId: string, label: string, x: number, y: number, paletteConstruct: string, instantiationTargetType: InstantiationTargetType): Promise<ModelElementDetail> {
    const payload: Object = {
      x: Math.trunc(x),
      y: Math.trunc(y),
      paletteConstruct,
      uuid: shapeId,
      label,
      instantiationType: instantiationTargetType
    };

    return this.http.put(this.endpointSettings.getElementEndpoint(modelId), payload)
      .toPromise()
      .then(response => response.json() as ModelElementDetail);
  }

  copyElement(existingElement: ModelElementDetail, modelId: string): Promise<ModelElementDetail> {
    const payload: Object = {
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
    };

    return this.http.put(this.endpointSettings.getElementEndpoint(modelId), payload)
      .toPromise()
      .then(response => response.json() as ModelElementDetail);
  }

  createConnection(modelId: string, shapeId: string, x: number, y: number, from: string, to: string, paletteConstruct: string, instantiationTargetType: InstantiationTargetType): Promise<ModelElementDetail> {
    const payload: Object = {
      x: Math.trunc(x),
      y: Math.trunc(y),
      paletteConstruct,
      uuid: shapeId,
      from,
      to,
      instantiationType: instantiationTargetType
    };

    return this.http.put(this.endpointSettings.getConnectionEndpoint(modelId), payload)
      .toPromise()
      .then(response => response.json() as ModelElementDetail);
  }

  getElements(modelId: string): Promise<ModelElementDetail[]> {
    return this.http.get(this.endpointSettings.getElementEndpoint(modelId))
      .toPromise()
      .then(response => response.json() as ModelElementDetail[]);
  }

  updateElement(elementDetail: ModelElementDetail, modelId: string) {
    this.http.put(this.endpointSettings.getElementDetailEndpoint(modelId, elementDetail.id), elementDetail)
      .toPromise()
      .then(response => console.log(response));
  }

  deleteElement(modelId: string, shapeId: string) {
    this.http.delete(this.endpointSettings.getElementDetailEndpoint(modelId, shapeId))
      .toPromise()
      .then(response => console.log(response));
  }

  deleteModel(modelId: string): Promise<Object> {
    return this.http.delete(this.endpointSettings.getModelEndpoint(modelId))
      .toPromise();
  }

  updateModel(model: Model) {
    this.http.put(this.endpointSettings.getModelEndpoint(model.id), {
      id: model.id,
      label: model.label
    }).toPromise()
      .then(response => console.log(response));
  }

  getOptionsForRelation(relationId: string): Promise<RelationOptions> {
    return this.http.get(this.endpointSettings.getRelationOptionsEndpoint(relationId))
      .toPromise()
      .then(response => response.json() as RelationOptions);
  }

  getInstancesOfConceptualElements(id: string): Promise<ModellingLanguageConstructInstance[]> {
    return this.http.post(this.endpointSettings.getConceptualElementInstances(), {
      id
    })
      .toPromise()
      .then(response => response.json() as ModellingLanguageConstructInstance[]);
  }
}
