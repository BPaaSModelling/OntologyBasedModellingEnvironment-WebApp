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
import {MatListModule, MatButtonModule, MatToolbarModule, MatDialogModule, MatTabsModule, MatCardModule,
  MatSelectModule, MatOptionModule, MatInputModule, MatFormFieldModule, MatCheckboxModule, MatExpansionModule} from '@angular/material';
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

const appRoutes: Routes = [
  { path: 'modeller', component: ModellingEnvironmentComponent},
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
    HeaderPaneComponent
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
    ModalInsertObjectPropertyComponent
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
    ReactiveFormsModule
  ],
  providers: [ModellerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
