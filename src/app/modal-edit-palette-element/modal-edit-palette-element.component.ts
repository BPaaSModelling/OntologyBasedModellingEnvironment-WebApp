import { Component, Inject, OnInit, Output, EventEmitter } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog} from "@angular/material";
import {PaletteElementModel} from "../_models/PaletteElement.model";
import {ModellerService} from "../modeller.service";
import {ModalCreateDomainElementsComponent} from "../modal-create-domain-elements/modal-create-domain-elements.component";
import {ModalInsertPropertyComponent} from "../modal-insert-datatype-property/modal-insert-datatype-property.component";
import {ModalEditPropertiesComponent} from "../modal-edit-datatype-property/modal-edit-datatype-property.component";
import {ModalEditObjectPropertyComponent} from "../modal-edit-object-property/modal-edit-object-property.component";
import {DatatypePropertyModel} from "../_models/DatatypeProperty.model";
import {ObjectPropertyModel} from "../_models/ObjectProperty.model";
import {ModalInsertObjectPropertyComponent} from "../modal-insert-object-property/modal-insert-object-property.component";

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
  public domainName: string;
  //public domainNameArr = [];
  public namespaceMap: Map<string, string>;
  public datatypeProperties: DatatypePropertyModel[] = [];
  public objectProperties: ObjectPropertyModel[] = [];
  public config1: any;

  constructor(public dialogRef: MatDialogRef<ModalEditPaletteElementComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, public mService: ModellerService, public dialog: MatDialog) {
    this.currentPaletteElement = new PaletteElementModel();
    this.namespaceMap = new Map<string, string>();
    //this.domainElement = new DomainElementModel();

  }

  ngOnInit() {
    const domainNameArr = this.data.paletteElement.representedLanguageClass.split('#');
    // const domainStr = domainNameArr[0]; //!!!Fix this - should be in format bmm:BMMTask (prefix case-sensitive)
    /*this.mService.queryNamespaceMap().subscribe(
      (data) => {
      this.namespaceMap = data;
      this.namespaceMap.set('bmm','hello');
      console.log(data);*/
      // const arr = domainStr.split("/");
      const prefix = this.data.paletteElement.languagePrefix;
      this.domainName = prefix + ':' + domainNameArr[1];
      this.mService.queryDatatypeProperties(this.domainName).subscribe(
        (response) => {
          this.datatypeProperties = response;
          console.log("Loading datatype properties");
        }
      );
      this.mService.queryObjectProperties(this.domainName).subscribe(
        (response) => {
          this.objectProperties = response;
          console.log("Loading object properties");
        }
      );
      //}
    //);
    this.mService.queryDomainClasses();
    this.mService.queryModelingElementClasses();
    this.mService.queryPaletteCategories();
    this.mService.queryNamespacePrefixes();

    this.currentPaletteElement.label = this.data.paletteElement.label;
    this.currentPaletteElement.thumbnailURL = this.data.paletteElement.thumbnailURL;
    console.log('this.data.paletteElement.thumbnailURL ' +this.data.paletteElement.thumbnailURL);
    console.log('this.data.paletteElement.imageURL ' +this.data.paletteElement.imageURL);
    console.log('this.data.paletteElement.comment ' +this.data.paletteElement.comment);
    console.log(this.data.paletteElement);
    this.currentPaletteElement.imageURL = this.data.paletteElement.imageURL;
    this.currentPaletteElement.comment = this.data.paletteElement.comment;
    this.currentPaletteElement.uuid = this.data.paletteElement.uuid;

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

    this.config1 = {
      displayKey: 'label',
      search: true,
      height: 'auto',
      placeholder: 'Select Semantic Domain Element',
      limitTo: 15,
      moreText: 'more',
      noResultsFound: 'No results found!',
      searchPlaceholder: 'Search'
    };
  }

  onCloseCancel() {
    this.dialogRef.close('Cancel');
  }

  selectionChanged($event: any) {
    console.log('Selection changed');
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
    const dialogRef1 = this.dialog.open(ModalInsertPropertyComponent, {
      data: {paletteElement: element },
      height:'80%',
      width: '800px',
      disableClose: false,
    });

    const sub = dialogRef1.componentInstance.newPropertyAdded.subscribe(() => {
      /*const prefix = this.namespaceMap.get(this.domainName);
      const domainStr = prefix + ":" + this.domainNameArr[1];
      console.log('domainStr ' + domainStr);*/
      this.mService.queryDatatypeProperties(this.domainName).subscribe(
        (response) => {
          this.datatypeProperties = response;
          dialogRef1.close('Cancel');
        }
      );
    });

    dialogRef1.afterClosed().subscribe(result => {
      console.log('The dialog was closed : ' + result);
    });
  }

  editElementInOntology() {
    const ele = this.currentPaletteElement;
    console.log('Edited label: '+ele.label);
    console.log('Edited comment: '+ele.comment);
    console.log('Edited image: '+ele.imageURL);
    console.log('Edited thumbnail: '+ele.thumbnailURL);
    this.mService.editElement(this.data.paletteElement, ele).subscribe(
      (response) => {
        //this.elementEdited.emit(ele);
        this.dialogRef.close();
      }
    );
  }

  /*loadProperties() {
    console.log('domainName: ' + this.domainName);
    console.log(this.namespaceMap);
    const prefix = this.namespaceMap.get(this.domainName);
    console.log('domainName ' + prefix);
    const domainStr = prefix + ":" + this.domainNameArr[1];
    this.mService.queryDatatypeProperties(domainStr);
  }*/

  modifyProperty(element: PaletteElementModel, property: DatatypePropertyModel) {
    const dialogRef1 = this.dialog.open(ModalEditPropertiesComponent, {
      data: {paletteElement: element, datatypeProperty: property },
      height:'80%',
      width: '800px',
      disableClose: false,
    });

    const sub = dialogRef1.componentInstance.propertyEdited.subscribe(() => {
      //const prefix = this.namespaceMap.get(this.domainName);
      //const domainStr = prefix + ":" + this.domainNameArr[1];
      this.mService.queryDatatypeProperties(this.domainName).subscribe(
        (response) => {
          this.datatypeProperties = response;
          dialogRef1.close('Cancel');
        }
      );

    });

    dialogRef1.afterClosed().subscribe(result => {
      console.log('The dialog was closed : ' + result);
    });
  }

  deleteProperty(property: DatatypePropertyModel) {
    this.mService.deleteDatatypeProperty(property).subscribe(
      (response) => {
        this.mService.queryDatatypeProperties(this.domainName).subscribe(
          (response1) => {
            this.datatypeProperties = response1;
          }
        );

      }
    );
  }

  openInsertNewRelation(element: PaletteElementModel) {

    const dialogRef1 = this.dialog.open(ModalInsertObjectPropertyComponent, {
      data: {paletteElement: element },
      height:'80%',
      width: '800px',
      disableClose: false,
    });

    const sub = dialogRef1.componentInstance.newRelationAdded.subscribe(() => {
      this.mService.queryObjectProperties(this.domainName).subscribe(
        (response) => {
          this.objectProperties = response;
          dialogRef1.close('Cancel');
        }
      );
    });

    dialogRef1.afterClosed().subscribe(result => {
      console.log('The dialog was closed : ' + result);
    });
  }

  modifyObjectProperty(element: PaletteElementModel, property: ObjectPropertyModel) {
    const dialogRef1 = this.dialog.open(ModalEditObjectPropertyComponent, {
      data: {paletteElement: element, objectProperty: property },
      height:'80%',
      width: '800px',
      disableClose: false,
    });

    const sub = dialogRef1.componentInstance.objectPropertyEdited.subscribe(() => {
      //const prefix = this.namespaceMap.get(this.domainName);
      //const domainStr = prefix + ":" + this.domainNameArr[1];
      this.mService.queryObjectProperties(this.domainName).subscribe(
        (response) => {
          this.objectProperties = response;
          dialogRef1.close('Cancel');
        }
      );

    });

    dialogRef1.afterClosed().subscribe(result => {
      console.log('The dialog was closed : ' + result);
    });
  }

  deleteObjectProperty(property: ObjectPropertyModel) {
    this.mService.deleteObjectProperty(property).subscribe(
      (response) => {
        this.mService.queryObjectProperties(this.domainName).subscribe(
          (response1) => {
            this.objectProperties = response1;
          }
        );

      }
    );
  }
}
