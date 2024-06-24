import {Component, OnInit} from '@angular/core';
import {ModellerService} from './core/services/modeller/modeller.service';
import {catchError, filter, finalize, switchMap, take, tap} from 'rxjs/operators';
import {Auth0Service} from './core/services/auth/auth0.service';
import {of} from 'rxjs/internal/observable/of';
import {forkJoin} from 'rxjs/internal/observable/forkJoin';
import {from} from 'rxjs/internal/observable/from';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  constructor(private modellerService: ModellerService,
              private auth0Service: Auth0Service) {
  }

  ngOnInit(): void {
    // THIS CODE IS NOT USED IN THE CURRENT IMPLEMENTATION, REMOVE IF NOT NEEDED
    // Called when the user logs in
    /*
    this.auth0Service.auth.isAuthenticated$.pipe(
      switchMap(isAuthenticated => {
        if (isAuthenticated) {
          return this.auth0Service.loginCallback();
        } else {
          console.log('User is not authenticated. Cannot load Github languages and prefixes.');
          return of(null);
        }
      })
    ).subscribe(() => {
      console.log('Loading Github languages and prefixes from Fuseki and Github...');
      forkJoin([
        this.loadPrefixesPreparationFromGithub(),
        this.loadPrefixesPreparation(),
        this.loadGithubLanguages()
      ]).subscribe(
        ([githubPrefixes, fusekiPrefixes, githubLanguages]) => {
          console.log('All data loaded', githubPrefixes, fusekiPrefixes, githubLanguages);
        },
        error => {
          console.error('Error during login callback', error);
        }
      );
    });
     */
  }
/*
  loadPrefixesPreparation() {
    return from(this.modellerService.queryLanguagesFromFuseki()).pipe(
      tap(() => {
        console.log('Successfully loaded prefixes from Fuseki');
      }),
      catchError(error => {
        console.error('Error loading prefixes from Fuseki', error);
        return of(null);
      })
    );
  }

  loadPrefixesPreparationFromGithub() {
    return this.modellerService.queryLanguagesFromGithub().pipe(
      tap(() => {
        console.log('Successfully loaded prefixes from Github');
      }),
      catchError(error => {
        console.error('Error loading prefixes from Github', error);
        return of(null);
      })
    );
  }

  loadGithubLanguages() {
    return this.modellerService.queryLanguagesFromGithub().pipe(
      tap(() => {
        console.log('Successfully loaded Github languages');
      }),
      catchError(error => {
        console.error('Error loading Github languages', error);
        return of(null);
      })
    );
  }
  */
}
