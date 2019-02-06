import {DomainElementModel} from "./DomainElement.model";
import {QueryAnswerModel} from "./QueryAnswer.model";

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
  representedDomainClass: string[];
  languageSubclasses: QueryAnswerModel[];
  languagePrefix: string;
  comment: string;
  /*datatypePropertyId: string;
  datatypePropertyLabel: string;
  datatypePropertyValue: string;*/
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
