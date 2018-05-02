export class PaletteElementModel {
  id: string;
  uuid: string;
  label: string;
  paletteCategory: string;
  parentElement: string;
  hiddenFromPalette: boolean;
  childElements: PaletteElementModel[];
  representedLanguageClass: string;
  representedDomainClass: string;
  datatypePropertyId: string;
  datatypePropertyLabel: string;
  datatypePropertyValue: string;
  shape: string;
  backgroundColor: string;
  height: string;
  width: string;
  labelPosition: string;
  iconURL: string;
  iconPosition: string;
  usesImages: boolean;
  imageURL: string;
  thumbnailURL: string;

  tempLabel;
  tempUuid;
}
