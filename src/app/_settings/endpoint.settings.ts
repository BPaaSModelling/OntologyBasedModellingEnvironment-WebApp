export class EndpointSettings {

  private static ENDPOINT                   : string = 'http://localhost:8080';
  private static PALETTEELEMENTS            : string = '/ModEnv/getPaletteElements';
  private static PALETTECATEGORIES          : string = '/ModEnv/getPaletteCategories';
  private static CREATEELEMENT              : string = '/ModEnv/createElement';
  private static GETDOMAINCLASSES           : string = '/ModEnv/getDomainClasses';

  public static getPaletteElementsEndpoint(): string {
    return EndpointSettings.ENDPOINT + EndpointSettings.PALETTEELEMENTS;
  }

  public static getPaletteCategoriesEndpoint(): string {
    return EndpointSettings.ENDPOINT + EndpointSettings.PALETTECATEGORIES;
  }

  public static getCreateElementEndpoint(): string {
    return EndpointSettings.ENDPOINT + EndpointSettings.CREATEELEMENT;
  }

  public static getDomainClassesEndpoint(): string {
    return EndpointSettings.ENDPOINT + EndpointSettings.GETDOMAINCLASSES;
  }
}
