import {Component, EventEmitter, Input, OnInit, SimpleChanges, HostListener, Output} from '@angular/core';
import 'fabric';
import {MetamodelElementModel} from "../_models/MetamodelElement.model";
import {PaletteElementModel} from "../_models/PaletteElement.model";
import {VariablesSettings} from "../_settings/variables.settings";
import {isNullOrUndefined} from "util";
import {UUID} from 'angular2-uuid';
import { Overlay } from 'ngx-modialog';
import {ModellerService} from "../modeller.service";
declare let fabric;


@Component({
  selector: 'app-modelling-area',
  templateUrl: './modelling-area.component.html',
  styleUrls: ['./modelling-area.component.css']
})
export class ModellingAreaComponent implements OnInit {

  @Input() new_element: PaletteElementModel;
  @Output() showElementPropertyModal = new EventEmitter();
  canvas: any;
  private boundBox;
  private shape;
  private key;
  private linkMode: boolean;
  private linkConnector: any;

  constructor(public mService: ModellerService) {
  }

  ngOnInit() {

    this.canvas = new fabric.Canvas('myCanvas', {});
    this.canvas.setHeight(document.getElementById('container').offsetHeight);
    this.canvas.setWidth(document.getElementById('container').offsetWidth);

    //this.canvas.addEventListener(self, 'dblclick',this.canvas.getActiveObject());
    fabric.util.addListener(this.canvas.upperCanvasEl, 'dblclick', (event) => {
      console.log("double click captured");
      if (this.canvas.getActiveObject().get('type') === 'group' && this.canvas.getActiveObject()._objects.length == 2) {
        let element;
        let label;
        let items;
        let indexElement;
        let indexLabel;
        let group = this.canvas.getActiveObject();
        //Ungroup and assign textbox and element to local variables
        items = group._objects;
        group._restoreObjectsState();
        this.canvas.remove(group);
        for (var i = 0; i < items.length; i++) {
          if (items[i].get('type') === 'image') {
            element = items[i];
          } else {
            label = items[i];
          }
        }
        this.canvas.add(element).renderAll();
        if (element.label != undefined){
          label = element.label;
        }

        this.canvas.add(label);
        //let indexLabel = this.canvas.getObjects().indexOf(label);
        //let indexElement = this.canvas.getObjects().indexOf(element);
        this.canvas.setActiveObject(this.canvas.getObjects()[this.canvas.getObjects().indexOf(label)]);
        this.canvas.getObjects()[this.canvas.getObjects().indexOf(label)].enterEditing();
        this.canvas.renderAll();

        indexElement = this.canvas.getObjects().indexOf(element);
        indexLabel = this.canvas.getObjects().indexOf(label);

        this.canvas.getObjects()[indexLabel].on('deselected', () => {
          if (this.canvas.getObjects()[indexLabel] != undefined) {
          console.log("captured deselection of " + this.canvas.getObjects()[indexLabel])
          if (element.label != undefined) {
            element.label = this.canvas.getObjects()[indexLabel];
            if (indexElement > indexLabel) {
              this.canvas.remove(element);
              this.canvas.remove(this.canvas.getObjects()[indexLabel]);
            } else {
              this.canvas.remove(this.canvas.getObjects()[indexLabel]);
              this.canvas.remove(element);
            }
            let new_group = new fabric.Group([element, element.label]);
            this.canvas.add(new_group).renderAll();
            this.mService.editLabel(element.uuid);
          }
        }
        });
      }

    });
  }

  ngOnChanges(changes: SimpleChanges) {
    //TODO to change with ngDoCheck
    this.printNewElement(changes.new_element.currentValue);
    //console.log(changes.new_element.currentValue);
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.key = event.key;
    if (this.key === 'Delete') {
      this.deleteElement();
    }
    if (this.key === 'Enter' && this.canvas.getActiveObject().type === 'group'){
      this.openInstancePropertyModal(this.canvas.getActiveObject());
    }
  }

  printNewElement(element: PaletteElementModel): void {

    if (element !== undefined) {
      let label;
      let oImg;
      let group;
      let items;
      oImg = fabric.Image.fromURL('../assets/images/' + element.imageURL, (img) => {
        oImg = img.set({
          uuid: element.tempUuid,
          classType: element.id,
          isAnElement: true,
          left: 0,
          top: 0,
          angle: 0}).scale(1);

        label = new fabric.Textbox("New " + element.label, {
          id: UUID.UUID(),
          top: oImg.top + 5,
          left: oImg.left + 5,
          fontSize: 12,
          width: oImg.width - 10 ,
          textAlign: 'center',

        });

        oImg.set({label: label,
          textLabel: label.text});

        group = new fabric.Group([oImg, oImg.label]);

        this.canvas.add(group).renderAll();
        console.log(oImg)
        this.mService.createElementInOntology(oImg.toObject());

        });

      }
} //https://stackoverflow.com/questions/24449481/fabric-js-grouped-itext-not-editable

  deleteElement(): void {
    if (this.canvas.getActiveObject() !== undefined) {
      this.canvas.getActiveObject().remove();
    }

    if (this.canvas.getActiveGroup() !== undefined) {
      this.canvas.getActiveGroup().remove();
    }
    }

  openInstancePropertyModal(element) {
    this.showElementPropertyModal.emit(this.getElementFromGroup(element));
  }

  getElementFromGroup(group){
    let items;
    let modElement;
    if (group.get('type') === 'group' ){
      items = group._objects;
      for (var i = 0; i < items.length; i++) {
        if (items[i].get('isAnElement') === true) {
          modElement = items[i];
          //console.log('found modElement: ' + modElement.elementType + ", " + modElement.elementUuid + ", " + modElement.label.text )
        }
      }
    }
    return modElement;
  }

  degroupObjects(object){
    console.log(object);
    }
}
// https://github.com/shlomiassaf/ngx-modialog
