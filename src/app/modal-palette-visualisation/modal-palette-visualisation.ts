import {Component, Inject} from '@angular/core';

import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Model} from '../_models/Model.model';
import {DiagramDetail} from '../_models/DiagramDetail.model';
import {ModellerService} from '../modeller.service';
import {DiagramDetailAndModel} from '../_models/DiagramDetailAndModel';
import {PaletteElementModel} from '../_models/PaletteElement.model';
import {VariablesSettings} from '../_settings/variables.settings';

@Component({
  selector: 'modal-palette-visualisation',
  templateUrl: 'modal-palette-visualisation.html',
  styleUrls: ['./modal-palette-visualisation.css']
})
export class ModalPaletteVisualisation {

  paletteElements: PaletteElementModel[] = [];
  selectedPaletteElement: PaletteElementModel;
  imageRoot: string = VariablesSettings.IMG_ROOT;

  constructor(
    public dialogRef: MatDialogRef<ModalPaletteVisualisation>,
    private modellerService: ModellerService,
    @Inject(MAT_DIALOG_DATA) public data: DiagramDetailAndModel) {}

  ngOnInit(): void {
    this.modellerService.paletteElements.forEach(paletteElement => {
      this.resolveChildHierarchyOrPushToSelector(paletteElement);
    });
  }

  resolveChildHierarchyOrPushToSelector(paletteElement: PaletteElementModel) {
    if (paletteElement.childElements === undefined || paletteElement.childElements.length === 0) {
      if ((this.data.diagramDetail.modelElementType === 'ModelingElement' || this.data.diagramDetail.modelElementType === 'ModelingContainer') &&
        paletteElement.type === 'PaletteElement') {
        this.paletteElements.push(paletteElement);
      }

      if (this.data.diagramDetail.modelElementType === 'ModelingRelation' &&
        paletteElement.type === 'PaletteConnector') {
        this.paletteElements.push(paletteElement);
      }
    } else {
      paletteElement.childElements.forEach(childElement => this.resolveChildHierarchyOrPushToSelector(childElement));
    }
  }

  comparePaletteElements(o1: PaletteElementModel, o2: PaletteElementModel) {
    return o1.id === o2.id;
  }

  onNoClick(): void {
    this.dialogRef.close('Cancel');
  }

  save() {
    this.dialogRef.close({
      action: 'Save',
      paletteConstruct: "po:" + this.selectedPaletteElement.id.split("#")[1]
    });
  }
}
