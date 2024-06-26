//rename folder and file with the new name , is not upload

import {Component, OnInit} from '@angular/core';
import {ModellerService} from '../../core/services/modeller/modeller.service';
import {PaletteElementModel} from '../../shared/models/PaletteElement.model';
import {MatDialog} from '@angular/material/dialog';
import {filter, switchMap, take, tap} from 'rxjs/operators';
import {Auth0Service} from '../../core/services/auth/auth0.service';


@Component({
  selector: 'app-modelling-environment',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  propElement: Object;
  new_element: PaletteElementModel;
  showProp: boolean;


  constructor(private modellerService: ModellerService,
              public dialog: MatDialog,
              private authService: Auth0Service) {
    this.showProp = false;
  }

  ngOnInit() {
    this.loadPrefixesPreparationFromGithub();
    this.loadPrefixesPreparation();
    // this.loadGithubLanguages();
  }


  async loadPrefixesPreparation() {
    await this.modellerService.queryLanguagesFromFuseki();
  }

  async loadPrefixesPreparationFromGithub() {
    await this.modellerService.queryLanguagesFromGithub();
  }

  loadGithubLanguages() {
    if (!this.modellerService.prefixAdvancedGithub || this.modellerService.prefixAdvancedGithub.length === 0) {
      this.modellerService.queryLanguagesFromGithub().pipe(
        take(1),
        filter(q => !!q),
        switchMap((queryLanguages) => {
          console.log('preloading the language ttl files');
          return this.modellerService.queryUploadLanguagesSelectedOnFuseki(queryLanguages);
        }),
        tap(() => {
          // Ensure that all previous tasks have been completed and then authenticate
          console.log('Successfully preloaded the language ttl files');
        }),
      ).subscribe({
        error: err => {
          console.error('Error during preloading ttl files from Github', err);
        }
      });
    }
  }
}
