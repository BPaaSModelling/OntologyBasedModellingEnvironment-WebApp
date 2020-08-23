import {Relation} from './Relation.model';

export class Diagram {
  id: string
  label: string
  x: number
  y: number
  width: number
  height: number
  imageUrl: string
  fromArrow: string
  toArrow: string
  arrowStroke: string
  modelElementType: string
  modelElementAttributes: Relation[]
}
