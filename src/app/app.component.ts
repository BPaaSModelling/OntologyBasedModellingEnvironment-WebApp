import {Component, OnInit} from '@angular/core';
import {ModellerService} from './core/services/modeller/modeller.service';
import {filter, switchMap, take} from 'rxjs/operators';
import {AuthService} from './core/services/auth/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  constructor(private modellerService: ModellerService, private auth: AuthService) {
  }

  ngOnInit(): void {

    this.auth.authenticate().then(() => {
      // This part is executed when the observable completes successfully -> authentication successful

      if (!this.modellerService.prefixAdvancedGithub || this.modellerService.prefixAdvancedGithub.length === 0) {
        this.modellerService.queryLanguagesFromGithub().pipe(
          take(1),
          filter(q => !!q),
          switchMap((queryLanguages) => {
            return this.modellerService.queryUploadLanguagesSelectedOnFuseki(queryLanguages);
          })
        ).subscribe(() => {
          console.log("preloaded the language ttl files");
        });
      }
    }).catch((error) => {
      // Handle error
      console.error(`Error during authentication: ${error}`);
    });
  }
}
