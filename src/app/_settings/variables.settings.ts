export class VariablesSettings{

  public static paletteCategoryConnectorsURI: string = 'http://fhnw.ch/modelingEnvironment/PaletteOntology#Category_Connectors';
  public static paletteCategoryGroupsURI: string = 'http://fhnw.ch/modelingEnvironment/PaletteOntology#Category_Groups';
  public static paletteCatogorySwimlanesURI: string = 'http://fhnw.ch/modelingEnvironment/PaletteOntology#Category_Swimlanes';
  public static iconLocation: string = '../assets/images/';

  /* Set the following property to the root of the images folder */
  public static IMG_ROOT: string = '../assets/images/';

  /* START - Properties to the names of the categories in the PaletteOntology */
  public static CAT_ACTIVITIES: string = 'Category_Activities';
  public static CAT_EVENTS: string = 'Category_Events';
  public static CAT_GATEWAYS: string = 'Category_Gateways';
  public static CAT_DATA: string = 'Category_Data';
  public static CAT_GROUPS: string = 'Category_Groups';
  public static CAT_CONNECTORS: string = 'Category_Connectors';
  /* END - Properties to the names of the categories in the PaletteOntology */

  /* START - Properties to the complete path of the images for the categories */
  public static eventImagePath: string = VariablesSettings.IMG_ROOT + VariablesSettings.CAT_EVENTS + "/";
  public static activitiesImagePath: string = VariablesSettings.IMG_ROOT + VariablesSettings.CAT_ACTIVITIES + "/";
  public static gatewaysImagePath: string = VariablesSettings.IMG_ROOT + VariablesSettings.CAT_GATEWAYS + "/";
  public static dataObjectImagePath: string = VariablesSettings.IMG_ROOT + VariablesSettings.CAT_DATA + "/";
  public static groupImagePath: string = VariablesSettings.IMG_ROOT + VariablesSettings.CAT_GROUPS + "/";
  public static connectorsImagePath: string = VariablesSettings.IMG_ROOT + VariablesSettings.CAT_CONNECTORS + "/";
  /* END - Properties to the complete path of the images for the categories */
}
