export class EndpointSettings {

  private static ENDPOINT                   : string = 'http://localhost:8080';
  private static PALETTEELEMENTS            : string = '/ModEnv/getPaletteElements';
  private static PALETTECATEGORIES          : string = '/ModEnv/getPaletteCategories';
  private static CREATEELEMENT              : string = '/ModEnv/createPalletteElement';
  private static CREATEINSTANCE             : string = '/ModEnv/createCanvasInstance';
  private static CREATEDOMAINELEMENT        : string = '/ModEnv/createDomainElement';
  private static GETDOMAINCLASSES           : string = '/ModEnv/getDomainOntologyClasses';
  private static CREATEDATATYPEPROPERTY     : string = '/ModEnv/createDatatypeProperty';
  private static GETDATATYPEPROPERTIES      : string = '/ModEnv/getDatatypeProperties';

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

  public static getCreateDatatypePropertyEndpoint(): string {
    return EndpointSettings.ENDPOINT + EndpointSettings.CREATEDATATYPEPROPERTY;
  }

  public static getDatatypePropertyEndpoint(domainName): string {
    console.log('domainName in endpoint.setting.ts: ' + domainName);
    return EndpointSettings.ENDPOINT + EndpointSettings.GETDATATYPEPROPERTIES + '/' + domainName;
  }
}
