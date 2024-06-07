import {Component, OnInit} from '@angular/core';
import {ModellerService} from './core/services/modeller/modeller.service';
import {filter, finalize, switchMap, take, tap} from 'rxjs/operators';
import {Auth0Service} from './core/services/auth/auth0.service';
import {LoadingService} from './core/services/loading/loading.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  constructor(private modellerService: ModellerService,
              private auth0Service: Auth0Service,
              private loadingService: LoadingService) {
  }

  ngOnInit(): void {
    // Called when the user logs in
    this.auth0Service.loginCallback().subscribe(isAuthenticated => {
      if (isAuthenticated) {
        console.log('Loading Github languages and prefixes from Fuseki and Github...');
        this.loadPrefixesPreparationFromGithub();
        this.loadPrefixesPreparation();
        this.loadGithubLanguages();
      } else {
        console.log('User is not authenticated. Cannot load Github languages and prefixes.');
      }
    }, error => {
      console.error('Error during login callback', error);
    });
  }

  async loadPrefixesPreparation() {
    this.loadingService.setLoading(true);
    await this.modellerService.queryLanguagesFromFuseki();
    this.loadingService.setLoading(false);
  }
  async loadPrefixesPreparationFromGithub() {
    this.loadingService.setLoading(true);
    this.modellerService.queryLanguagesFromGithub();
    this.loadingService.setLoading(false);
  }

  async loadGithubLanguages() {
    console.log("ModellerService.prefixAdvancedGithub", this.modellerService.prefixAdvancedGithub);
    if (!this.modellerService.prefixAdvancedGithub || this.modellerService.prefixAdvancedGithub.length === 0) {
      this.loadingService.setLoading(true);
      this.modellerService.queryLanguagesFromGithub().pipe(
        take(1),
        filter(q => !!q),
        switchMap((queryLanguages) => {
          console.log("preloading the language ttl files");
          return this.modellerService.queryUploadLanguagesSelectedOnFuseki(queryLanguages).pipe(
            tap((result) => {
              console.log('Result of queryUploadLanguagesSelectedOnFuseki:', result);
            }))
        }),
        tap(() => {
          // Ensure that all previous tasks have been completed and then authenticate
          console.log("Successfully preloaded the language ttl files");
        }),
        finalize(() => {
          // will always be executed, regardless of successful or unsuccessful completion
          this.loadingService.setLoading(false);
          console.log("Finished preloading ttl files from Github");
        })
      ).subscribe({
        next: value => console.log('Observable chain emitted: ', value),
        error:err => {
          console.error("Error during preloading ttl files from Github", err);
        }
      });
    } else {
      console.log("Languages from Github already loaded");
    }
  }
}
