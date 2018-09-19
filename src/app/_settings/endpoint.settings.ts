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
  private static GETDATATYPEPROPERTIES      : string = '/ModEnv/getDatatypeProperties';
  private static DELETEPALETTEELEMENT       : string = '/ModEnv/deletePaletteElement';
  private static HIDEPALETTEELEMENT         : string = '/ModEnv/hidePaletteElement';
  private static CREATELANGUAGESUBCLASSES   : string = '/ModEnv/createModelingLanguageSubclasses';
  private static GETALLNAMESPACEPREFIXES    : string = '/ModEnv/getAllNamespacePrefixes';
  private static MODIFYELEMENT              : string = '/ModEnv/modifyElement';
  private static EDITDATATYPEPROPERTY       : string = '/ModEnv/editDatatypeProperty';
  private static DELETEDATATYPEPROPERTY     : string = '/ModEnv/deleteDatatypeProperty';

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

  public static getDatatypePropertyEndpoint(domainName): string {
    return EndpointSettings.ENDPOINT + EndpointSettings.GETDATATYPEPROPERTIES + '/' + domainName;
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

  public static getModifyElementEndpoint(): string {
    return EndpointSettings.ENDPOINT + EndpointSettings.MODIFYELEMENT;
  }

  public static getEditDatatypePropertyEndpoint(): string {
    return EndpointSettings.ENDPOINT + EndpointSettings.EDITDATATYPEPROPERTY;
  }

  public static getDeleteDatatypePropertyEndpoint(): string {
    return EndpointSettings.ENDPOINT + EndpointSettings.DELETEDATATYPEPROPERTY;
  }
}
