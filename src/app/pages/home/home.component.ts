//rename folder and file with the new name , is not upload

import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
import {ModellerService} from '../../core/services/modeller/modeller.service';
import {PaletteElementModel} from '../../shared/models/PaletteElement.model';
import { MatDialog } from '@angular/material/dialog';
import {filter, switchMap, take} from 'rxjs/operators';
import {AuthService} from '../../core/services/auth/auth.service';


@Component({
  selector: 'app-modelling-environment',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  propElement: Object;
  new_element: PaletteElementModel;
  showProp: boolean;
  isLoading = false;  // boolean loading indicator flag

  constructor(private modellerService: ModellerService,
              public dialog: MatDialog,
              private auth: AuthService) {
    this.showProp = false;
  }

  ngOnInit() {
    this.loadPrefixesPreparationFromGithub();
    this.loadPrefixesPreparation();
    this.loadGithubLanguages();
  }



  async loadPrefixesPreparation() {

    await this.modellerService.queryLanguagesFromFuseki();

  }
  async loadPrefixesPreparationFromGithub() {

    await this.modellerService.queryLanguagesFromGithub();

  }

  loadGithubLanguages() {
    if (!this.modellerService.prefixAdvancedGithub || this.modellerService.prefixAdvancedGithub.length === 0) {
      this.isLoading = true;
      this.modellerService.queryLanguagesFromGithub().pipe(
        take(1),
        filter(q => !!q),
        switchMap((queryLanguages) => {
          console.log("preloading the language ttl files");
          return this.modellerService.queryUploadLanguagesSelectedOnFuseki(queryLanguages);
        })
      ).subscribe(() => {
        console.log("preloaded the language ttl files");
        this.isLoading = false;
        this.auth.authenticate();
      }, error => {
        console.error("Error during preloading ttl files", error);
        this.isLoading = false;
      });
    }
  }


  }
