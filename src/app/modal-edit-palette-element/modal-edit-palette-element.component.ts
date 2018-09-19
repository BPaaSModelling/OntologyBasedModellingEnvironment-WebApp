import { Component, Inject, OnInit, Output, EventEmitter } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog} from "@angular/material";
import {PaletteElementModel} from "../_models/PaletteElement.model";
import {ModellerService} from "../modeller.service";
import {ModalCreateDomainElementsComponent} from "../modal-create-domain-elements/modal-create-domain-elements.component";
import {ModalInsertPropertyComponent} from "../modal-insert-property/modal-insert-property.component";
import {ModalEditPropertiesComponent} from "../modal-edit-properties/modal-edit-properties.component";
import {DatatypePropertyModel} from "../_models/DatatypeProperty.model";

@Component({
  selector: 'app-modal-edit-palette-element',
  templateUrl: './modal-edit-palette-element.component.html',
  styleUrls: ['./modal-edit-palette-element.component.css']
})
export class ModalEditPaletteElementComponent implements OnInit {

  public currentPaletteElement: PaletteElementModel;
  public activityImageList: any;
  public eventImageList: any;
  public gatewayImageList: any;
  public dataObjectImageList: any;
  public groupImageList: any;
  private domainName: string;

  constructor(public dialogRef: MatDialogRef<ModalEditPaletteElementComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, public mService: ModellerService, public dialog: MatDialog) {
    this.currentPaletteElement = new PaletteElementModel();
    //this.domainElement = new DomainElementModel();
    const domainNameArr = [] = this.data.paletteElement.representedLanguageClass.split('#');
    this.domainName = 'bpmn:' + domainNameArr[1];
  }

  ngOnInit() {
    this.mService.queryDomainClasses();
    this.mService.queryModelingElementClasses();
    this.mService.queryPaletteCategories();
    this.mService.queryNamespacePrefixes();
    this.mService.queryDatatypeProperties(this.domainName);
    console.log(this.data.paletteElement.paletteCategory);

    this.currentPaletteElement.label = this.data.paletteElement.label;
    this.currentPaletteElement.thumbnailURL = this.data.paletteElement.thumbnailURL;
    console.log('this.data.paletteElement.thumbnailURL ' +this.data.paletteElement.thumbnailURL);
    console.log('this.data.paletteElement.imageURL ' +this.data.paletteElement.imageURL);
    this.currentPaletteElement.imageURL = this.data.paletteElement.imageURL;

    this.activityImageList = [
      {"imageURL":"assets/images/BPMN-CMMN/AdHoc_Subprocess.png", "imageName":"AdHoc_Subprocess.png", "label":"AdHoc Subprocess", "thumbnailURL":"assets/images/BPMN-CMMN/Thumbnail_AdHoc_Subprocess.png", "thumbnailName" : "Thumbnail_AdHoc_Subprocess.png"},
      {"imageURL":"assets/images/BPMN-CMMN/Business_Rule_Task.png", "imageName":"Business_Rule_Task.png", "label":"Business Rule Task", "thumbnailURL":"/assets/images/BPMN-CMMN/Thumbnail_Business_Rule_Task.png", "thumbnailName" : "Thumbnail_Business_Rule_Task.png"},
      {"imageURL":"assets/images/BPMN-CMMN/Call_Activity.png", "imageName":"Call_Activity.png", "label":"Call Activity", "thumbnailURL":"/assets/images/BPMN-CMMN/Thumbnail_Call_Activity.png", "thumbnailName" : "Thumbnail_Call_Activity.png"},
      {"imageURL":"assets/images/BPMN-CMMN/Collapsed_Subprocess.png", "imageName":"Collapsed_Subprocess.png", "label":"Collapsed Subprocess", "thumbnailURL":"/assets/images/BPMN-CMMN/Thumbnail_Collapsed_Subprocess.png", "thumbnailName" : "Thumbnail_Collapsed_Subprocess.png"},
      {"imageURL":"assets/images/BPMN-CMMN/Discretionary_Task.png", "imageName":"Discretionary_Task.png", "label":"Discretionary Task", "thumbnailURL":"/assets/images/BPMN-CMMN/Thumbnail_Discretionary_Task.png", "thumbnailName" : "Thumbnail_Discretionary_Task.png"},
      {"imageURL":"assets/images/BPMN-CMMN/KoGu.png", "imageName":"KoGu.png", "label":"KoGu", "thumbnailURL":"/assets/images/BPMN-CMMN/Thumbnail_KoGu.png", "thumbnailName" : "Thumbnail_KoGu.png"},
      {"imageURL":"assets/images/BPMN-CMMN/KoGu_Stroke.png", "imageName":"KoGu_Stroke.png", "label":"KoGu Stroke", "thumbnailURL":"/assets/images/BPMN-CMMN/Thumbnail_KoGu_Stroke.png", "thumbnailName" : "Thumbnail_KoGu_Stroke.png"},
      {"imageURL":"assets/images/BPMN-CMMN/Message_Task.png", "imageName":"Message_Task.png", "label":"Message Task", "thumbnailURL":"/assets/images/BPMN-CMMN/Thumbnail_Message_Task.png", "thumbnailName" : "Thumbnail_Message_Task.png"},
      {"imageURL":"assets/images/BPMN-CMMN/Receive_Task.png", "imageName":"Receive_Task.png", "label":"Receive Task", "thumbnailURL":"/assets/images/BPMN-CMMN/Thumbnail_Receive_Task.png", "thumbnailName" : "Thumbnail_Receive_Task.png"},
      {"imageURL":"assets/images/BPMN-CMMN/Send_Task.png", "imageName":"Send_Task.png", "label":"Send Task", "thumbnailURL":"/assets/images/BPMN-CMMN/Thumbnail_Send_Task.png", "thumbnailName" : "Thumbnail_Send_Task.png"},
      {"imageURL":"assets/images/BPMN-CMMN/Service_Task.png", "imageName":"Service_Task.png", "label":"Service Task", "thumbnailURL":"/assets/images/BPMN-CMMN/Thumbnail_Service_Task.png", "thumbnailName" : "Thumbnail_Service_Task.png"},
      {"imageURL":"assets/images/BPMN-CMMN/Subprocess.png", "imageName":"Subprocess.png", "label":"Subprocess", "thumbnailURL":"/assets/images/BPMN-CMMN/Thumbnail_Subprocess.png", "thumbnailName" : "Thumbnail_Subprocess.png"},
      {"imageURL":"assets/images/BPMN-CMMN/Task.png", "imageName":"Task.png", "label":"Task", "thumbnailURL":"/assets/images/BPMN-CMMN/Thumbnail_Task.png", "thumbnailName" : "Thumbnail_Task.png"},
      {"imageURL":"assets/images/BPMN-CMMN/User_Task.png", "imageName":"User_Task.png", "label":"User Task", "thumbnailURL":"/assets/images/BPMN-CMMN/Thumbnail_User_Task.png", "thumbnailName" : "Thumbnail_User_Task.png"},
      {"imageURL":"assets/images/BPMN-CMMN/Manual_Task.png", "imageName":"Manual_Task.png", "label":"Manual Task", "thumbnailURL":"/assets/images/BPMN-CMMN/Thumbnail_Manual_Task.png", "thumbnailName" : "Thumbnail_Manual_Task.png"}
    ];

    this.eventImageList = [
      {"imageURL":"assets/images/BPMN-CMMN/Simple_End.png", "imageName":"Simple_End.png", "label":"Simple End", "thumbnailURL":"/assets/images/BPMN-CMMN/Simple_End.png", "thumbnailName" : "Simple_End.png"},
      {"imageURL":"assets/images/BPMN-CMMN/Simple_Intermediate.png", "imageName":"Simple_Intermediate.png", "label":"Simple Intermediate", "thumbnailURL":"/assets/images/BPMN-CMMN/Simple_Intermediate.png", "thumbnailName" : "Simple_Intermediate.png"},
      {"imageURL":"assets/images/BPMN-CMMN/Simple_Start.png", "imageName":"Simple_Start.png", "label":"Simple Start", "thumbnailURL":"/assets/images/BPMN-CMMN/Simple_Start.png", "thumbnailName" : "Simple_Start.png"},
      {"imageURL":"assets/images/BPMN-CMMN/Message_End.png", "imageName":"Message_End.png", "label":"Message End", "thumbnailURL":"/assets/images/BPMN-CMMN/Message_End.png", "thumbnailName" : "Message_End.png"},
      {"imageURL":"assets/images/BPMN-CMMN/Message_Intermediate.png", "imageName":"Message_Intermediate.png", "label":"Message Intermediate", "thumbnailURL":"/assets/images/BPMN-CMMN/Message_Intermediate.png", "thumbnailName" : "Message_Intermediate.png"},
      {"imageURL":"assets/images/BPMN-CMMN/Message_Start.png", "imageName":"Message_Start.png", "label":"Message Start", "thumbnailURL":"/assets/images/BPMN-CMMN/Message_Start.png", "thumbnailName" : "Message_Start.png"},
      {"imageURL":"assets/images/BPMN-CMMN/Timer_Start.png", "imageName":"Timer_Start.png", "label":"Timer Start", "thumbnailURL":"/assets/images/BPMN-CMMN/Timer_Start.png", "thumbnailName" : "Timer_Start.png"},
      {"imageURL":"assets/images/BPMN-CMMN/Timer_Intermediate.png", "imageName":"Timer_Intermediate.png", "label":"Timer Intermediate", "thumbnailURL":"/assets/images/BPMN-CMMN/Timer_Intermediate.png", "thumbnailName" : "Timer_Intermediate.png"}
    ];

    this.gatewayImageList = [
      {"imageURL":"assets/images/BPMN-CMMN/Simple_Gateway.png", "imageName":"Simple_Gateway.png", "label":"Simple Gateway", "thumbnailURL":"/assets/images/BPMN-CMMN/Simple_Gateway.png", "thumbnailName" : "Simple_Gateway.png"},
      {"imageURL":"assets/images/BPMN-CMMN/EventBased_Gateway.png", "imageName":"EventBased_Gateway.png", "label":"Event Based Gateway", "thumbnailURL":"/assets/images/BPMN-CMMN/EventBased_Gateway.png", "thumbnailName" : "EventBased_Gateway.png"},
      {"imageURL":"assets/images/BPMN-CMMN/Exclusive_Gateway.png", "imageName":"Exclusive_Gateway.png", "label":"Exclusive Gateway", "thumbnailURL":"/assets/images/BPMN-CMMN/Exclusive_Gateway.png", "thumbnailName" : "Exclusive_Gateway.png"},
      {"imageURL":"assets/images/BPMN-CMMN/Parallel_Gateway.png", "imageName":"Parallel_Gateway.png", "label":"Parallel Gateway", "thumbnailURL":"/assets/images/BPMN-CMMN/Parallel_Gateway.png", "thumbnailName" : "Parallel_Gateway.png"}
    ];

    this.dataObjectImageList = [
      {"imageURL":"assets/images/BPMN-CMMN/DataObject.png", "imageName":"DataObject.png", "label":"Data Object", "thumbnailURL":"/assets/images/BPMN-CMMN/DataObject.png", "thumbnailName" : "DataObject.png"},
      {"imageURL":"assets/images/BPMN-CMMN/DataOutput.png", "imageName":"DataOutput.png", "label":"Data Output", "thumbnailURL":"/assets/images/BPMN-CMMN/DataOutput.png", "thumbnailName" : "DataOutput.png"},
      {"imageURL":"assets/images/BPMN-CMMN/DataInput.png", "imageName":"DataInput.png", "label":"Data Input", "thumbnailURL":"/assets/images/BPMN-CMMN/DataInput.png", "thumbnailName" : "DataInput.png"},
      {"imageURL":"assets/images/BPMN-CMMN/DataStore.png", "imageName":"DataStore.png", "label":"Data Store", "thumbnailURL":"/assets/images/BPMN-CMMN/DataStore.png", "thumbnailName" : "DataStore.png"}
    ];

    this.groupImageList = [
      {"imageURL":"assets/images/BPMN-CMMN/Group.jpg", "imageName":"Group.jpg", "label":"Group Large", "thumbnailURL":"/assets/images/BPMN-CMMN/Group.jpg", "thumbnailName" : "Group.jpg"},
      {"imageURL":"assets/images/BPMN-CMMN/Group4Process.bmp", "imageName":"Group4Process.bmp", "label":"Group of Processes", "thumbnailURL":"/assets/images/BPMN-CMMN/Group4Process.bmp", "thumbnailName" : "Group4Process.bmp"},
      {"imageURL":"assets/images/BPMN-CMMN/GroupOfAvtivities.png", "imageName":"GroupOfAvtivities.png", "label":"Group of Activities", "thumbnailURL":"/assets/images/BPMN-CMMN/GroupOfAvtivities.png", "thumbnailName" : "GroupOfAvtivities.png"}
    ];
  }

  onCloseCancel() {
    this.dialogRef.close('Cancel');
  }

  openCreateDomainElementModalFromEdit(element: PaletteElementModel) {

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

  openInsertNewProperty(element: PaletteElementModel) {
    const dialogRef = this.dialog.open(ModalInsertPropertyComponent, {
      data: {paletteElement: element },
      height:'80%',
      width: '800px',
      disableClose: false,
    });

    const sub = dialogRef.componentInstance.newPropertyAdded.subscribe(() => {
      this.mService.queryDatatypeProperties(this.domainName);
      this.dialogRef.close('Cancel');
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed : ' + result);
    });
  }

  editElementInOntology() {
    const ele = this.currentPaletteElement;
    console.log('Edited label: '+ele.label);
    console.log('Edited image: '+ele.imageURL);
    console.log('Edited thumbnail: '+ele.thumbnailURL);
    this.mService.editElement(this.data.paletteElement, ele);
    this.dialogRef.close();
  }

  modifyProperty(element: PaletteElementModel, property: DatatypePropertyModel) {
    const dialogRef1 = this.dialog.open(ModalEditPropertiesComponent, {
      data: {paletteElement: element, datatypeProperty: property },
      height:'80%',
      width: '800px',
      disableClose: false,
    });

    const sub = dialogRef1.componentInstance.propertyEdited.subscribe(() => {
      this.mService.queryDatatypeProperties(this.domainName);
      dialogRef1.close('Cancel');
    });

    dialogRef1.afterClosed().subscribe(result => {
      console.log('The dialog was closed : ' + result);
    });
  }

  deleteProperty(property: DatatypePropertyModel) {
    this.mService.deleteDatatypeProperty(property);
  }
}
