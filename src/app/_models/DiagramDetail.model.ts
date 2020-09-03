import {Relation} from './Relation.model';
import {ModelElementAttributes} from './ModelElementAttributes.model';

export class DiagramDetail {
  id: string
  label: string
  note: string
  x: number
  y: number
  width: number
  height: number
  modelingLanguageConstructInstance: string
  diagramRepresentsModel: string
  paletteConstruct: string
  modelElementAttributes: ModelElementAttributes
  fromArrow: string
  toArrow: string
  arrowStroke: string
  imageUrl: string
  fromDiagram: string
  toDiagram: string
  containedDiagrams: string[]
  modelElementType: string
}
