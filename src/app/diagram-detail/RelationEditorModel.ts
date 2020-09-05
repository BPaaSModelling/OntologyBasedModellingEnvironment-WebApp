import {Relation} from '../_models/Relation.model';

export class RelationEditorModel {
  relation: Relation
  selectorOptions: string[]

  constructor(relation: Relation) {
    this.relation = relation;
    this.selectorOptions = undefined;
  }
}
