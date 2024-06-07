import { Component, OnInit } from '@angular/core';
import {filter, take} from 'rxjs/operators';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {NavigationService} from '../../services/navigation/navigation.service';
import {Auth0Service} from '../../services/auth/auth0.service';
import {LoadingService} from '../../services/loading/loading.service';

@Component({
  selector: 'app-header-pane',
  templateUrl: './header-pane.component.html',
  styleUrls: ['./header-pane.component.css']
})
export class HeaderPaneComponent implements OnInit {
  public showModellerHeader = false;
  public modelName: string;

  isLoading: boolean;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private navigation: NavigationService,
              protected authService: Auth0Service,
              private loadingService: LoadingService) {
    // Subscribe to the loading service to update the spinner in the header
    this.loadingService.isLoading$.subscribe(isLoading => {this.isLoading = isLoading;});
  }

  ngOnInit() {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      if (this.router.url.includes('/modeller')) {
        this.setQueryParamsModeller();
      } else {
        this.showModellerHeader = false;
      }
    });
  }

  private setQueryParamsModeller(): void {
    this.activatedRoute.queryParams
      .pipe(take(1))
      .subscribe(params => {
          if (params.id && params.label) {
            this.modelName = params.label;
            this.showModellerHeader = true;
          }
        }
      );
  }

  navigateBack(): void {
    //this.navigation.back();
    this.router.navigate(['/diagramManagement']);
  }

}
