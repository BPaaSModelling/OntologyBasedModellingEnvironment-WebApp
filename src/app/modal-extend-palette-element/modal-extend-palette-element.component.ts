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
public activityImageList: any;
public eventImageList: any;
public gatewayImageList: any;
public dataObjectImageList: any;
public groupImageList: any;
@Output() showCreateDomainElementModalFromExtend = new EventEmitter();
  constructor(
    public dialogRef: MatDialogRef<ModalExtendPaletteElementComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public mService: ModellerService, public dialog: MatDialog) {
    this.currentPaletteElement = new PaletteElementModel();
    this.domainElement = new DomainElementModel();
  }


  ngOnInit() {
    this.mService.queryDomainClasses();
    this.mService.queryModelingElementClasses();
    this.mService.queryPaletteCategories();
    console.log(this.data.paletteElement.paletteCategory);
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
    ele.paletteCategory = this.data.paletteElement.paletteCategory; // 'lo:Category_Activities';
    console.log('category: ' + this.currentPaletteElement.paletteCategory);
    ele.representedLanguageClass = 'bpmn:' + (this.currentPaletteElement.label).replace(new RegExp(' ', 'g'), ''); /*important property to display in the pallette*/

    console.log('Thumbnail not selected: ' + this.currentPaletteElement.thumbnailURL);
    // Set width and height of the image as per category
    if (ele.paletteCategory.search('Category_Activities') !== -1) {
      ele.width = 100;
      ele.height = 70;
      if (this.currentPaletteElement.thumbnailURL === null) {
        ele.thumbnailURL = '/assets/images/BPMN-CMMN/Thumbnail_Task.png';
      }
    } else if (ele.paletteCategory.search('Category_Events') !== -1) {
      ele.width = 70;
      ele.height = 70;
      if (this.currentPaletteElement.thumbnailURL === null) {
        ele.thumbnailURL = '/assets/images/BPMN-CMMN/Simple_Start.png';
      }
    } else if (ele.paletteCategory.search('Category_Gateways') !== -1) {
      ele.width = 70;
      ele.height = 100;
      if (this.currentPaletteElement.thumbnailURL === null) {
        ele.thumbnailURL = '/assets/images/BPMN-CMMN/Simple_Gateway.png';
      }
    } else if (ele.paletteCategory.search('Category_Data') !== -1) {
      ele.width = 70;
      ele.height = 100;
    }

    console.log('stringified element:' + JSON.stringify(ele));


    const isSuccess: Boolean = this.mService.createElementInOntology(JSON.stringify(ele));

    console.log("Here is the result of the query: " + isSuccess);
    //HERE I GET THE VALUES FROM THE GUI
    //console.log('label val:' + this.currentPaletteElement.label);
    //console.log('domain ontology val: ' + this.currentPaletteElement.representedLanguageClass);
    //THEN I SUPPOSE TO CALL THE SERVICE AND INSERT THE currentPaletteElement IN THE ONTOLOGY
   //console.log('val: ' + val);
   //console.log(this.data);
   //if (isSuccess) {
     this.dialogRef.close();
   //}
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

  addSubClassesForLanguage(element: PaletteElementModel) {
    console.log('Selected subclasses : ');
    console.log(element);
    this.mService.createLanguageSubclasses(JSON.stringify(element));
  }

}
