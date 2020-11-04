import {DataSource} from '@angular/cdk/collections';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Relation} from '../_models/Relation.model';
import {Observable} from 'rxjs/Observable';
import {ModellerService} from '../modeller.service';
import {RelationEditorModel} from './RelationEditorModel';

export class RelationDatasource extends DataSource<RelationEditorModel> {

  data: BehaviorSubject<RelationEditorModel[]>;

  public constructor(private entries: RelationEditorModel[]) {
    super();
    this.data = new BehaviorSubject<RelationEditorModel[]>(entries);
  }

  /** Stream of data that is provided to the table. */


  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<RelationEditorModel[]> {
    return this.data;
  }

  disconnect() {}
}
