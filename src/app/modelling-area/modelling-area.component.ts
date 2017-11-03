import {Component, EventEmitter, Input, OnInit, SimpleChanges, HostListener} from '@angular/core';
import 'fabric';
import {MetamodelElementModel} from "../_models/MetamodelElement.model";
import {PaletteElementModel} from "../_models/PaletteElement.model";

declare let fabric;


@Component({
  selector: 'app-modelling-area',
  templateUrl: './modelling-area.component.html',
  styleUrls: ['./modelling-area.component.css']
})
export class ModellingAreaComponent implements OnInit {

  @Input() new_element: PaletteElementModel;
  private canvas;
  private boundBox;
  private shape;
  private key;
  private isEdited = false;

  constructor() {
  }

  ngOnInit() {
    console.log(fabric.version);

    this.canvas = new fabric.Canvas('canvas', {});
    this.canvas.setHeight(document.getElementById('container').offsetHeight);
    this.canvas.setWidth(document.getElementById('container').offsetWidth);
  }

  ngOnChanges(changes: SimpleChanges) {
    //TODO to change with ngDoCheck
    this.printNewElement(changes.new_element.currentValue);
    console.log(changes.new_element.currentValue);
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.key = event.key;
    let selectedElement = this.canvas.getActiveObject();
    if ((this.key === 'Backspace' || this.key === 'Delete')
    && selectedElement.get('type') === 'group') {
      this.deleteElement();
    }
  }

  @HostListener('document:dblclick', ['$event'])
  handleMouseEvent(event: MouseEvent) {
    let selectedElement = this.canvas.getActiveObject();
    // Delete task and label together
    if (selectedElement.get('type') === 'group') {
      this.ungroupElements();
    }
    /*else if (selectedElement.get('type') === 'i-text') {
      this.editLabel();
    }*/
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    let selectedElement = this.canvas.getActiveObject();
    console.log(selectedElement);
    // this.groupElements();
    /*if ((selectedElement === null || selectedElement === undefined)
    || (selectedElement !==null && selectedElement !== undefined && selectedElement.get('type') !== 'group')) {
      this.groupElements();
    }*/
  }

  // Create new task with the default label
  printNewElement(element: PaletteElementModel): void {
    if (element !== undefined) {
      fabric.Image.fromURL('../assets/images/' + element.imageURL, (img) =>{
        let oImg = img.set({
          left: 0,
          top: 0,
          angle: 0}).scale(1);
        this.canvas.add(oImg).renderAll();
        this.canvas.setActiveObject(oImg);
        this.addLabelToElement();
        });
      }
    }

    // Delete the task along with its label
    deleteElement(): void {
      if (this.canvas.getActiveObject() !== undefined && this.canvas.getActiveObject() !== null) {
      this.canvas.remove(this.canvas.getActiveObject());
      }
    }

    // Attach label to the task
    addLabelToElement(): void {
      if (this.canvas.getActiveObject() !== undefined && this.canvas.getActiveObject() !== null) {
        let selectedElement = this.canvas.getActiveObject();
        let labelTxt = new fabric.IText('Text', {
          fontFamily: 'Ariel',
          fontSize: 16,
          left: selectedElement.aCoords.tl.x,
          top: selectedElement.aCoords.tl.y,
        });
        this.canvas.add(labelTxt);
        this.canvas.setActiveObject(labelTxt);
        let group = new fabric.Group([selectedElement, labelTxt], {
          left: selectedElement.aCoords.tl.x,
          top: selectedElement.aCoords.tl.y});
        this.canvas.add(group);
        selectedElement.remove();
      }
    }

    editLabel(): void {
      console.log('Inside editLabel');
    }

    ungroupElements(): void {
    console.log('Inside ungroupElements');
      let activeObject = this.canvas.getActiveObject();
      let taskElement = null, textElement = null;
      let cloneTaskElement = null, cloneTextElement = null;
      if (activeObject.get('type') === 'group') {
        let items = activeObject.getObjects();//_objects;
        activeObject._restoreObjectsState();
        this.canvas.remove(activeObject);

        for (let i = 0; i < items.length; i++) {
          this.canvas.add(items[i]);
          if (items[i].get('type') === 'i-text') {
            textElement = items[i];
            this.canvas.setActiveObject(textElement);
            textElement.enterEditing();
            textElement.selectAll();
          }
          else if (items[i].isType('image')) {
            taskElement = items[i];
            console.log('type of element');
            console.log(items[i].get('type'));
            console.log(taskElement);
          }

          this.canvas.item(this.canvas.size() - 1).hasControls = true;
        }

        this.canvas.renderAll();
        this.isEdited = true;
      }
        textElement.on('deselected', function() {
          console.log('on deselected');
          console.log(taskElement);
          console.log(textElement);

          cloneTaskElement = taskElement.clone();
          cloneTextElement = textElement.clone();

          let lft = taskElement.aCoords.tl.x;
          let tp = taskElement.aCoords.tl.y;

          this.canvas.remove(taskElement);
          this.canvas.remove(textElement);

          let group1 = new fabric.Group([cloneTaskElement, cloneTextElement], {
            left: lft,
            top: tp
          });
          this.canvas.add(group1);
        });


    }

    groupElements(): void {
    console.log('Inside groupElements');
    console.log(this.isEdited);
    if (this.isEdited) {
      const lft = this.canvas.item(this.canvas.size()-2).aCoords.tl.x;
      const tp = this.canvas.item(this.canvas.size()-2).aCoords.tl.y;
      let group = new fabric.Group([
        this.canvas.item(this.canvas.size()-2).clone(),
        this.canvas.item(this.canvas.size()-1).clone()
      ], {
        left: lft,
        top: tp
      });

      this.canvas.remove(this.canvas.item(this.canvas.size()-2));
      this.canvas.remove(this.canvas.item(this.canvas.size()-1));
      this.canvas.add(group);
    }
    }

  printNewElement2(element: PaletteElementModel): void {
    if (element !== undefined) {
      this.shape = new fabric.Rect({
        width: 200,
        height: 150,
        fill: 'white',
        stroke: 'black'
      });
      this.shape.id = 'id' + 1;
      this.canvas.add(this.shape);
    }
  }
}
