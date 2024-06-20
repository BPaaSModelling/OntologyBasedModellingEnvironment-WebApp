import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private _isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this._isLoading.asObservable();

  constructor() { }

  setLoading(isLoading: boolean): void {
    this._isLoading.next(isLoading);
    console.log('Loading state changed to: ', this._isLoading.value);
  }
}
