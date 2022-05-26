import {BrowserModule } from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';
import {AppComponent } from './app.component';
import {ModellingEnvironmentComponent } from './modelling-environment/modelling-environment.component';
import {PaletteAreaComponent } from './palette-area/palette-area.component';
import {ModellingAreaComponent } from './modelling-area/modelling-area.component';
import {RouterModule, Routes} from '@angular/router';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import {ModellerService} from './modeller.service';
import {FlexLayoutModule} from '@angular/flex-layout';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToolRecursivePaletteElementComponent} from './-tool-recursive-palette-element/-tool-recursive-palette-element.component';
import {ContextMenuModule} from 'ngx-contextmenu';
import {ModalInstancePropertiesComponent} from './modal-instance-properties/modal-instance-properties.component';
import {ModalPaletteElementPropertiesComponent} from './modal-palette-element-properties/modal-palette-element-properties.component';
import { ModalExtendPaletteElementComponent } from './modal-extend-palette-element/modal-extend-palette-element.component';
import {ModalConnectorElementPropertiesComponent} from './modal-connector-element-properties/modal-connector-element-properties.component';
import { ModalInsertPropertyComponent } from './modal-insert-datatype-property/modal-insert-datatype-property.component';
import { ModalConnectorManageCombinationsComponent } from './modal-connector-manage-combinations/modal-connector-manage-combinations.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ModalCreateDomainElementsComponent } from './modal-create-domain-elements/modal-create-domain-elements.component';
import { ModalEditPaletteElementComponent } from './modal-edit-palette-element/modal-edit-palette-element.component';
import { ModalEditPropertiesComponent } from './modal-edit-datatype-property/modal-edit-datatype-property.component';
import { ModalAddPropertiesComponent } from './modal-add-properties/modal-add-properties.component';
import { ModalInsertObjectPropertyComponent } from './modal-insert-object-property/modal-insert-object-property.component';
import { HeaderPaneComponent } from './header-pane/header-pane.component';
import { ModalEditBCObjectPropertyComponent } from './modal-edit-bc-object-property/modal-edit-bc-object-property.component';
import { ModalInsertLangobjectPropertyComponent } from './modal-insert-langobject-property/modal-insert-langobject-property.component';
import { ModalEditSMObjectPropertyComponent } from './modal-edit-sm-object-property/modal-edit-sm-object-property.component';
import { ModalModelCreation } from './modal-model-creation/modal-model-creation.component';
import { ModalModelLink } from "./modal-model-link/modal-model-link";
import { ModalElementNote } from "./modal-element-note/modal-element-note.component";
import {ModalModellingLanguageConstructInstanceLink} from './modal-modelling-language-construct-instance-link/modal-modelling-language-construct-instance-link';
import {ModalPaletteVisualisation} from './modal-palette-visualisation/modal-palette-visualisation';
import {ModalModelEdit} from './modal-model-edit/modal-model-edit.component';
import {ModalViewElementDetail} from './model-element-detail/model-element-detail.component';
import {ModalShowLanguageInstances} from './modal-show-language-instances/modal-show-language-instances';
import {EndpointSettings} from './_settings/endpoint.settings';
import {HttpClientModule} from '@angular/common/http';
import {ModalModelExport} from './modal-model-export/modal-model-export-component';
import {ImportExportEnvironmentComponent} from './importExport-environment/import-export-environment.component';
import {ModalModelMultipleExport} from './modal-model-multiple-export/modal-model-multiple-export.component';
import {ModalModelMultipleImport} from './modal-model-multiple-import/modal-model-multiple-import.component';
import { FileUploadComponent } from    './file-upload/file-upload.component';
import {HomeComponent} from './home/home.component';


const appRoutes: Routes = [
  { path: 'modeller', component: ModellingEnvironmentComponent},
  { path: 'importExport', component: ImportExportEnvironmentComponent},
  { path: 'home', component: HomeComponent},
  { path: '', component: HomeComponent},


];

export function appInit(endpointSettings: EndpointSettings) {
  return () => endpointSettings.load();
}

@NgModule({
  declarations: [
    ImportExportEnvironmentComponent,
    AppComponent,
    ModellingEnvironmentComponent,
    PaletteAreaComponent,
    HeaderPaneComponent,
    ModellingAreaComponent,
    ToolRecursivePaletteElementComponent,
    ModalInstancePropertiesComponent,
    ModalPaletteElementPropertiesComponent,
    ModalExtendPaletteElementComponent,
    ModalConnectorElementPropertiesComponent,
    ModalInsertPropertyComponent,
    ModalConnectorManageCombinationsComponent,
    ModalCreateDomainElementsComponent,
    ModalEditPaletteElementComponent,
    ModalEditPropertiesComponent,
    ModalAddPropertiesComponent,
    ModalInsertObjectPropertyComponent,
    HeaderPaneComponent,
    ModalEditBCObjectPropertyComponent,
    ModalInsertLangobjectPropertyComponent,
    ModalEditSMObjectPropertyComponent,
    ModalModelCreation,
    ModalViewElementDetail,
    ModalModelLink,
    ModalElementNote,
    ModalModellingLanguageConstructInstanceLink,
    ModalPaletteVisualisation,
    ModalModelEdit,
    ModalShowLanguageInstances,
    ModalModelExport,
    ModalModelMultipleExport,
    ModalModelMultipleImport,
    FileUploadComponent,
    HomeComponent

  ],
  entryComponents: [
    ModalInstancePropertiesComponent,
    ModalPaletteElementPropertiesComponent,
    ModalExtendPaletteElementComponent,
    ModalConnectorElementPropertiesComponent,
    ModalInsertPropertyComponent,
    ModalCreateDomainElementsComponent,
    ModalEditPaletteElementComponent,
    ModalAddPropertiesComponent,
    ModalEditPropertiesComponent,
    ModalEditBCObjectPropertyComponent,
    ModalEditSMObjectPropertyComponent,
    ModalInsertObjectPropertyComponent,
    ModalInsertLangobjectPropertyComponent,
    ModalModelCreation,
    ModalViewElementDetail,
    ModalModelLink,
    ModalElementNote,
    ModalModellingLanguageConstructInstanceLink,
    ModalPaletteVisualisation,
    ModalModelEdit,
    ModalShowLanguageInstances,
    ModalModelExport,
    ModalModelMultipleExport,
    ModalModelMultipleImport
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    FlexLayoutModule,
    ContextMenuModule.forRoot(),
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
    SelectDropDownModule,
    MatGridListModule,
    MatTableModule,
    MatSelectModule,
    MatFormFieldModule,
    NgMultiSelectDropDownModule.forRoot()

  ],
  providers: [
    ModellerService,
    EndpointSettings,
    {
      provide: APP_INITIALIZER,
      useFactory: appInit,
      multi: true,
      deps: [EndpointSettings]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
