import {Component, OnInit} from '@angular/core';
import {ModellerService} from './core/modeller/modeller.service';
import {filter, switchMap, take} from 'rxjs/operators';


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
  }
}
