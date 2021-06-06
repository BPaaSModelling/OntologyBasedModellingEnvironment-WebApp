import {BrowserModule } from '@angular/platform-browser';
import {NgModule } from '@angular/core';
import {HttpModule, JsonpModule} from '@angular/http';
import {AppComponent } from './app.component';
import {ModellingEnvironmentComponent } from './modelling-environment/modelling-environment.component';
import {PaletteAreaComponent } from './palette-area/palette-area.component';
import {ModellingAreaComponent } from './modelling-area/modelling-area.component';
import {RouterModule, Routes} from '@angular/router';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import {ModellerService} from './modeller.service';
import {FlexLayoutModule} from '@angular/flex-layout';
import {
  MatListModule,
  MatButtonModule,
  MatToolbarModule,
  MatDialogModule,
  MatTabsModule,
  MatCardModule,
  MatSelectModule,
  MatOptionModule,
  MatInputModule,
  MatFormFieldModule,
  MatCheckboxModule,
  MatExpansionModule,
  MatGridListModule,
  MatTableModule
} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToolRecursivePaletteElementComponent} from './-tool-recursive-palette-element/-tool-recursive-palette-element.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
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
import {MobileUploadComponent} from './mobile-upload/mobile-upload.component';

const appRoutes: Routes = [
  { path: 'modeller', component: ModellingEnvironmentComponent},
  { path: 'upload', component: MobileUploadComponent},
];


@NgModule({
  declarations: [
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
    MobileUploadComponent
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
    MobileUploadComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    HttpModule,
    JsonpModule,
    FlexLayoutModule,
    ContextMenuModule,
    MatListModule,
    MatButtonModule,
    MatToolbarModule,
    BrowserAnimationsModule,
    NgbModule,
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
    MatTableModule
  ],
  providers: [ModellerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
