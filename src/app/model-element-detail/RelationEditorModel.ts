import {Relation} from '../_models/Relation.model';
import {ValueModel} from './ValueModel';

export class RelationEditorModel {
  relation: Relation
  selectorOptions: ValueModel[]
  selectedValue: ValueModel

  constructor(relation: Relation) {
    this.relation = relation;
    this.selectorOptions = undefined;
  }
}
