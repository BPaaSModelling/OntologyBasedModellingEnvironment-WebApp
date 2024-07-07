import {APP_INITIALIZER, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { ReactFlowComponent} from 'ngx-reactflow';
import { HeaderComponent } from './header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import {ModellingEnvironmentComponent} from "./pages/modelling-environment/modelling-environment.component";
import {ModellingAreaComponent} from "./pages/modelling-environment/components/modelling-area/modelling-area.component";

import {PaletteAreaComponent} from "./pages/modelling-environment/components/palette-area/palette-area.component";
import {MatSnackBar} from "@angular/material/snack-bar";

import {MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule} from "@angular/material/form-field";
import {MatDialogModule} from "@angular/material/dialog";
import {MatTabsModule} from "@angular/material/tabs";
import {MatCardModule} from "@angular/material/card";
import {MatSelectModule} from "@angular/material/select";
import {MatInputModule} from "@angular/material/input";
import {MatOptionModule, MatRippleModule} from "@angular/material/core";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatExpansionModule} from "@angular/material/expansion";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule, Routes} from "@angular/router";
import {HttpClientModule} from "@angular/common/http";
import {MatListModule} from "@angular/material/list";
import {MatButtonModule} from "@angular/material/button";
import {MatTableModule} from "@angular/material/table";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {ToastrModule} from "ngx-toastr";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {
  ModellingAreaBPMNComponent
} from "./pages/modelling-environment/components/modelling-area-bpmn/modelling-area-bpmn.component";
import {
  PaletteAreaBPMNComponent
} from "./pages/modelling-environment/components/palette-area-bpmn/palette-area-bpmn.component";
import { ErrorPopupDialogComponent } from './error-popup-dialog/error-popup-dialog.component';
import { DeleteConfirmationDialogComponent } from './delete-confirmation-dialog/delete-confirmation-dialog.component';
const appRoutes: Routes = [
  {path: 'modeller', component: ModellingEnvironmentComponent},

];

import { ContextMenuModule } from '@perfectmemory/ngx-contextmenu';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ModellingEnvironmentComponent,
    ModellingAreaComponent,
    PaletteAreaComponent,
    PaletteAreaBPMNComponent,
    ModellingAreaBPMNComponent,
    ErrorPopupDialogComponent,
    DeleteConfirmationDialogComponent,
  ],
  imports: [
    BrowserModule,
    ReactFlowComponent,
    BrowserAnimationsModule,  // Required for Angular Material
    MatToolbarModule,
    BrowserModule,
    //RouterModule.forRoot(appRoutes, {}),
    HttpClientModule,
    //FlexLayoutModule,
    MatListModule,
    MatButtonModule,
    MatToolbarModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatTabsModule,
    MatCardModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatOptionModule,
    MatOptionModule,
    MatCheckboxModule,
    MatExpansionModule,
    FormsModule,
    ReactiveFormsModule,
    //SelectDropDownModule,
    MatGridListModule,
    MatTableModule,
    MatSelectModule,
    MatFormFieldModule,
    MatRippleModule,
    MatIconModule,
    MatMenuModule,
    //NgMultiSelectDropDownModule,
    MatButtonToggleModule,
    ToastrModule.forRoot(),
    MatProgressSpinnerModule,
    ContextMenuModule,
  ],
  providers: [
    MatSnackBar,
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {appearance: 'outline'}
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
