export class EndpointSettings {

  private static ENDPOINT                   : string = 'http://localhost:8080';
  private static PALETTEELEMENTS            : string = '/ModEnv/getPaletteElements';
  private static PALETTECATEGORIES          : string = '/ModEnv/getPaletteCategories';
  private static CREATEELEMENT              : string = '/ModEnv/createPalletteElement';
  private static CREATEINSTANCE             : string = '/ModEnv/createCanvasInstance';
  private static CREATEDOMAINELEMENT        : string = '/ModEnv/createDomainElement';
  private static GETDOMAINCLASSES           : string = '/ModEnv/getDomainOntologyClasses';
  private static GETMODELINGLANGUAGELASSES  : string = '/ModEnv/getModelingLanguageOntologyElements';
  private static CREATEDATATYPEPROPERTY     : string = '/ModEnv/createDatatypeProperty';
  private static CREATEOBJECTPROPERTY       : string = '/ModEnv/createObjectProperty';
  private static GETDATATYPEPROPERTIES      : string = '/ModEnv/getDatatypeProperties';
  private static GETOBJECTPROPERTIES      : string = '/ModEnv/getObjectProperties';
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

  public static getPaletteElementsEndpoint(): string {
    return EndpointSettings.ENDPOINT + EndpointSettings.PALETTEELEMENTS;
  }

  public static getPaletteCategoriesEndpoint(): string {
    return EndpointSettings.ENDPOINT + EndpointSettings.PALETTECATEGORIES;
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

  public static getCreateObjectPropertyEndpoint(): string {
    return EndpointSettings.ENDPOINT + EndpointSettings.CREATEOBJECTPROPERTY;
  }

  public static getDatatypePropertyEndpoint(domainName): string {
    return EndpointSettings.ENDPOINT + EndpointSettings.GETDATATYPEPROPERTIES + '/' + domainName;
  }

  public static getObjectPropertyEndpoint(domainName): string {
    return EndpointSettings.ENDPOINT + EndpointSettings.GETOBJECTPROPERTIES + '/' + domainName;
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
}
