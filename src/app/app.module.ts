import {BrowserModule } from '@angular/platform-browser';
import {NgModule } from '@angular/core';
import {HttpModule, JsonpModule} from '@angular/http';
import {AppComponent } from './app.component';
import {ModellingEnvironmentComponent } from './modelling-environment/modelling-environment.component';
import {PaletteAreaComponent } from './palette-area/palette-area.component';
import {ModellingAreaComponent } from './modelling-area/modelling-area.component';
import {RouterModule, Routes} from '@angular/router';
import {ModellerService} from './modeller.service';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatListModule, MatButtonModule, MatToolbarModule, MatDialogModule, MatTabsModule } from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToolRecursivePaletteElementComponent} from './-tool-recursive-palette-element/-tool-recursive-palette-element.component';
import {ContextMenuModule} from 'ngx-contextmenu';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { PropertyWindowComponent } from './property-window/property-window.component';
//import {ShContextMenuModule} from 'ng2-right-click-menu';

const appRoutes: Routes = [
  { path: 'modeller', component: ModellingEnvironmentComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    ModellingEnvironmentComponent,
    PaletteAreaComponent,
    ModellingAreaComponent,
    ToolRecursivePaletteElementComponent,
    PropertyWindowComponent,
  ],
  entryComponents: [
    PropertyWindowComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    HttpModule,
    JsonpModule,
    FlexLayoutModule,
    MatListModule,
    MatButtonModule,
    MatToolbarModule,
    MatDialogModule,
    MatTabsModule,
    BrowserAnimationsModule,
    ContextMenuModule,
    NgbModule,
//    ShContextMenuModule,
  ],
  providers: [ModellerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
