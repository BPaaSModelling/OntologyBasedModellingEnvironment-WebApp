export class EndpointSettings {

   private static ENDPOINT                   : string = 'http://localhost:8080'; // endpoint to locally deployed webservice
 // private static ENDPOINT                   : string = 'https://ontologybasedmodellingenv.herokuapp.com'; // heroku endpoint
  private static GETMODELINGLANGUAGES       : string = '/ModEnv/getModelingLanguages';
  private static GETMODELINGVIEWS           : string = '/ModEnv/getModelingViews';
  private static PALETTEELEMENTS            : string = '/ModEnv/getPaletteElements';
  private static PALETTECATEGORIES          : string = '/ModEnv/getPaletteCategories';
  private static CREATEELEMENT              : string = '/ModEnv/createPalletteElement';
  private static CREATEINSTANCE             : string = '/ModEnv/createCanvasInstance';
  private static CREATEDOMAINELEMENT        : string = '/ModEnv/createDomainElement';
  private static GETDOMAINCLASSES           : string = '/ModEnv/getDomainOntologyClasses';
  private static GETMODELINGLANGUAGELASSES  : string = '/ModEnv/getModelingLanguageOntologyElements';
  private static CREATEDATATYPEPROPERTY     : string = '/ModEnv/createDatatypeProperty';
  private static CREATEBRIDGECONNECTOR       : string = '/ModEnv/createBridgingConnector';
  private static CREATESEMANTICMAPPING       : string = '/ModEnv/createSemanticMapping';
  private static GETDATATYPEPROPERTIES      : string = '/ModEnv/getDatatypeProperties';
  private static GETBRIDGECONNECTORS      : string = '/ModEnv/getBridgeConnectors';
  private static GETSEMANTICMAPPINGS      : string = '/ModEnv/getSemanticMappings';
  private static DELETEPALETTEELEMENT       : string = '/ModEnv/deletePaletteElement';
  private static HIDEPALETTEELEMENT         : string = '/ModEnv/hidePaletteElement';
  private static CREATELANGUAGESUBCLASSES   : string = '/ModEnv/createModelingLanguageSubclasses';
  private static GETALLNAMESPACEPREFIXES    : string = '/ModEnv/getAllNamespacePrefixes';
  private static GETNAMESPACEMAP            : string = '/ModEnv/getNamespaceMap';
  private static MODIFYELEMENT              : string = '/ModEnv/modifyElement';
  private static EDITDATATYPEPROPERTY       : string = '/ModEnv/editDatatypeProperty';
  private static EDITOBJECTPROPERTY       : string = '/ModEnv/editObjectProperty';
  private static DELETEDATATYPEPROPERTY     : string = '/ModEnv/deleteDatatypeProperty';
  private static DELETEOBJECTPROPERTY     : string = '/ModEnv/deleteObjectProperty';

  private static GETDOMAINCONCEPTS          : string = '/ModEnv/getDomainConcepts';

  private static MODELS : string = '/ModEnv/model';
  private static ARROWS : string = '/ModEnv/arrow-structures';

  public static getModelsEndpoint(): string {
    return EndpointSettings.ENDPOINT + EndpointSettings.MODELS;
  }

  public static getModelEndpoint(modelId: string): string {
    return EndpointSettings.ENDPOINT + EndpointSettings.MODELS + '/' + modelId;
  }

  public static getElementEndpoint(modelId: string): string {
    return EndpointSettings.ENDPOINT + EndpointSettings.MODELS + '/' + modelId + '/element';
  }

  public static getConnectionEndpoint(modelId: string): string {
    return EndpointSettings.ENDPOINT + EndpointSettings.MODELS + '/' + modelId + '/connection';
  }

  public static getElementDetailEndpoint(modelId: string, id: string): string {
    return EndpointSettings.ENDPOINT + EndpointSettings.MODELS + '/' + modelId + '/element/' + id;
  }

  public static getArrowsEndpoint(): string {
    return EndpointSettings.ENDPOINT + EndpointSettings.ARROWS;
  }

  public static getModelingLanguagesEndpoint(): string {
    return EndpointSettings.ENDPOINT + EndpointSettings.GETMODELINGLANGUAGES;
  }

  public static getModelingViewsEndpoint(langId): string {
    return EndpointSettings.ENDPOINT + EndpointSettings.GETMODELINGVIEWS + '/' + langId;
  }

  public static getPaletteElementsEndpoint(): string {
    return EndpointSettings.ENDPOINT + EndpointSettings.PALETTEELEMENTS;
  }

  public static getPaletteCategoriesEndpoint(viewId): string {
    return EndpointSettings.ENDPOINT + EndpointSettings.PALETTECATEGORIES + '/' + viewId;
  }

  public static getCreateElementEndpoint(): string {
    return EndpointSettings.ENDPOINT + EndpointSettings.CREATEELEMENT;
  }

  public static getCreateInstanceEndpoint(): string {
    return EndpointSettings.ENDPOINT + EndpointSettings.CREATEINSTANCE;
  }

  public static getCreateDomainElementEndpoint(): string {
    return EndpointSettings.ENDPOINT + EndpointSettings.CREATEDOMAINELEMENT;
  }

  public static getDomainClassesEndpoint(): string {
    return EndpointSettings.ENDPOINT + EndpointSettings.GETDOMAINCLASSES;
  }

  public static getModelingElementClassesEndpoint(): string {
    return EndpointSettings.ENDPOINT + EndpointSettings.GETMODELINGLANGUAGELASSES;
  }

  public static getCreateDatatypePropertyEndpoint(): string {
    return EndpointSettings.ENDPOINT + EndpointSettings.CREATEDATATYPEPROPERTY;
  }

  public static getCreateBridgeConnectorEndpoint(): string {
    return EndpointSettings.ENDPOINT + EndpointSettings.CREATEBRIDGECONNECTOR;
  }

  public static getCreateSemanticMappingEndpoint(): string {
    return EndpointSettings.ENDPOINT + EndpointSettings.CREATESEMANTICMAPPING;
  }

  public static getDatatypePropertyEndpoint(domainName): string {
    return EndpointSettings.ENDPOINT + EndpointSettings.GETDATATYPEPROPERTIES + '/' + domainName;
  }

  public static getBridgeConnectorEndpoint(domainName): string {
    return EndpointSettings.ENDPOINT + EndpointSettings.GETBRIDGECONNECTORS + '/' + domainName;
  }

  public static getSemanticMappingEndpoint(domainName): string {
    return EndpointSettings.ENDPOINT + EndpointSettings.GETSEMANTICMAPPINGS + '/' + domainName;
  }

  public static getDeletePaletteElementEndpoint(): string {
    return EndpointSettings.ENDPOINT + EndpointSettings.DELETEPALETTEELEMENT;
  }

  public static getHidePaletteElementEndpoint(): string {
    return EndpointSettings.ENDPOINT + EndpointSettings.HIDEPALETTEELEMENT;
  }

  public static getCreateLanguageSubclassesEndpoint(): string {
    return EndpointSettings.ENDPOINT + EndpointSettings.CREATELANGUAGESUBCLASSES;
  }

  public static getGetAllNamespacePrefixesEndpoint(): string {
    return EndpointSettings.ENDPOINT + EndpointSettings.GETALLNAMESPACEPREFIXES;
  }

  public static getNamespaceMapEndpoint(): string {
    return EndpointSettings.ENDPOINT + EndpointSettings.GETNAMESPACEMAP;
  }

  public static getModifyElementEndpoint(): string {
    return EndpointSettings.ENDPOINT + EndpointSettings.MODIFYELEMENT;
  }

  public static getEditDatatypePropertyEndpoint(): string {
    return EndpointSettings.ENDPOINT + EndpointSettings.EDITDATATYPEPROPERTY;
  }

  public static getEditObjectPropertyEndpoint(): string {
    return EndpointSettings.ENDPOINT + EndpointSettings.EDITOBJECTPROPERTY;
  }

  public static getDeleteDatatypePropertyEndpoint(): string {
    return EndpointSettings.ENDPOINT + EndpointSettings.DELETEDATATYPEPROPERTY;
  }

  public static getDeleteObjectPropertyEndpoint(): string {
    return EndpointSettings.ENDPOINT + EndpointSettings.DELETEOBJECTPROPERTY;
  }

  public static getDomainConceptsEndpoint(): string {
    return EndpointSettings.ENDPOINT + EndpointSettings.GETDOMAINCONCEPTS;
  }

  public static getRelationOptionsEndpoint(relationid: string) {
    return EndpointSettings.ENDPOINT + "/ModEnv/relations/" + relationid + "/options";
  }

  public static getConceptualElementInstances() {
    return EndpointSettings.ENDPOINT + "/ModEnv/model-elements/search";
  }
}
