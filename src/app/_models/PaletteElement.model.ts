import {DomainElementModel} from "./DomainElement.model";

export class PaletteElementModel {
  id: string;
  uuid: string;
  label: string;
  paletteCategory: string;
  parentElement: string;
  parentLanguageClass: string;
  hiddenFromPalette: boolean;
  childElements: PaletteElementModel[];
  representedLanguageClass: string;
  representedDomainClass: DomainElementModel[];
  languageSubclasses: string[];
  languagePrefix: string;
  datatypePropertyId: string;
  datatypePropertyLabel: string;
  datatypePropertyValue: string;
  shape: string;
  backgroundColor: string;
  height: number;
  width: number;
  labelPosition: string;
  iconURL: string;
  iconPosition: string;
  usesImages: boolean;
  imageURL: string;
  thumbnailURL: string;

  tempLabel;
  tempUuid;
}
