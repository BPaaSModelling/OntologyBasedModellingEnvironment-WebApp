import {DataSource} from '@angular/cdk/collections';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Relation} from './Relation.model';
import {Observable} from 'rxjs/Observable';
import {ModellerService} from '../modeller.service';

export class RelationDatasource extends DataSource<Relation> {

  data: BehaviorSubject<Relation[]>;

  public constructor(private entries: Relation[]) {
    super();
    this.data = new BehaviorSubject<Relation[]>(entries);
  }

  /** Stream of data that is provided to the table. */


  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Relation[]> {
    return this.data;
  }

  disconnect() {}
}
