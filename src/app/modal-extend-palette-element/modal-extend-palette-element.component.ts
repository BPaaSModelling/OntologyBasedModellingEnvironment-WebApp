import {Component, Inject, OnInit, Output, EventEmitter} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {DomainElementModel} from "../_models/DomainElement.model";
import {ModellerService} from "../modeller.service";
import {PaletteElementModel} from "../_models/PaletteElement.model";
import {ModalCreateDomainElementsComponent} from "../modal-create-domain-elements/modal-create-domain-elements.component";
import {MatDialog} from "@angular/material";

@Component({
  selector: 'app-modal-extend-palette-element',
  templateUrl: './modal-extend-palette-element.component.html',
  styleUrls: ['./modal-extend-palette-element.component.css']
})
export class ModalExtendPaletteElementComponent implements OnInit {

 /*constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public mService: ModellerService) {

  }*/

private ontologyClasses: DomainElementModel[] = [];
public currentPaletteElement: PaletteElementModel;
public domainElement: DomainElementModel;
@Output() showCreateDomainElementModalFromExtend = new EventEmitter();
  constructor(
    public dialogRef: MatDialogRef<ModalExtendPaletteElementComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public mService: ModellerService, public dialog: MatDialog) {
    this.currentPaletteElement = new PaletteElementModel();
    this.domainElement = new DomainElementModel();
  }


  ngOnInit() {
    this.mService.queryDomainClasses();
    this.mService.queryPaletteCategories();
  }

  onCloseCancel() {
    this.dialogRef.close('Cancel');
  }

  createElementInOntology() {

    const ele = this.currentPaletteElement;
    ele.id = '';
    ele.uuid = (this.currentPaletteElement.label).replace(new RegExp(' ', 'g'), ''); // replace spaces
    console.log('uuid:' + ele.uuid);
    ele.label = this.currentPaletteElement.label;
    ele.hiddenFromPalette = false;
    ele.usesImages = false;
    ele.parentElement = (this.data.paletteElement.label).replace(new RegExp(' ', 'g'), ''); // replace spaces
    console.log('parent:' + ele.parentElement);
    ele.paletteCategory = this.currentPaletteElement.paletteCategory; // 'lo:Category_Activities';
    console.log('category: ' + this.currentPaletteElement.paletteCategory);
    ele.representedLanguageClass = 'bpmn:' + (this.currentPaletteElement.label).replace(new RegExp(' ', 'g'), ''); /*important property to display in the pallette*/

    console.log('stringified element:' + JSON.stringify(ele));


    const isSuccess: Boolean = this.mService.createElementInOntology(JSON.stringify(ele));

    console.log("Here is the result of the query: " + isSuccess);
    //HERE I GET THE VALUES FROM THE GUI
    //console.log('label val:' + this.currentPaletteElement.label);
    //console.log('domain ontology val: ' + this.currentPaletteElement.representedLanguageClass);
    //THEN I SUPPOSE TO CALL THE SERVICE AND INSERT THE currentPaletteElement IN THE ONTOLOGY
   //console.log('val: ' + val);
   //console.log(this.data);
   if (isSuccess) {
     this.dialogRef.close();
   }
  }

  mapToDomainOntology() {
    this.dialogRef.close('Cancel');
    let dialog = this.dialog.open(ModalCreateDomainElementsComponent, {
      height:'80%',
      width: '800px',
      data: 'This text is passed into the dialog!',
      disableClose: false,
    });
    dialog.afterClosed().subscribe(result => {
      console.log(`Dialog closed: ${result}`);
      //this.dialogResult = result;
    });
  }

  openCreateDomainElementModalFromExtend(element: PaletteElementModel) {

    const dialogRef = this.dialog.open(ModalCreateDomainElementsComponent, {
      data: {paletteElement: element },
      height:'80%',
      width: '800px',
      disableClose: false,
    });

    const sub = dialogRef.componentInstance.newDomainElementAdded.subscribe(() => {
      this.mService.queryDomainClasses();
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed : ' + result);
    });
  }

}
