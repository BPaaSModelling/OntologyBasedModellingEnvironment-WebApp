import {Component, OnInit} from '@angular/core';
import {ModellerService} from './core/services/modeller/modeller.service';
import {filter, switchMap, take} from 'rxjs/operators';
import {Auth0Service} from './core/services/auth/auth0.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  constructor(private modellerService: ModellerService) {
  }

  ngOnInit(): void {
  }
}
