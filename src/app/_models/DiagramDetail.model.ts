import {Relation} from './Relation.model';

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
  modelElementAttributes: Relation[]
  fromArrow: string
  toArrow: string
}
