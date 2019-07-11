import { Component, Inject, OnInit, Output, EventEmitter } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog} from "@angular/material";
import {PaletteElementModel} from "../_models/PaletteElement.model";
import {ModellerService} from "../modeller.service";
import {ModalCreateDomainElementsComponent} from "../modal-create-domain-elements/modal-create-domain-elements.component";
import {ModalInsertPropertyComponent} from "../modal-insert-datatype-property/modal-insert-datatype-property.component";
import {ModalEditPropertiesComponent} from "../modal-edit-datatype-property/modal-edit-datatype-property.component";
import {ModalEditBCObjectPropertyComponent} from "../modal-edit-bc-object-property/modal-edit-bc-object-property.component";
import {ModalEditSMObjectPropertyComponent} from "../modal-edit-sm-object-property/modal-edit-sm-object-property.component";
import {DatatypePropertyModel} from "../_models/DatatypeProperty.model";
import {ObjectPropertyModel} from "../_models/ObjectProperty.model";
import {ModalInsertObjectPropertyComponent} from "../modal-insert-object-property/modal-insert-object-property.component";
import {ModalInsertLangobjectPropertyComponent} from "../modal-insert-langobject-property/modal-insert-langobject-property.component";
import {VariablesSettings} from "../_settings/variables.settings";

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

  public sapscenesImageList: any;
  public sapscenesRelationsList: any;

  public domainName: string;
  //public domainNameArr = [];
  public namespaceMap: Map<string, string>;
  public datatypeProperties: DatatypePropertyModel[] = [];
  public bridgingConnectors: ObjectPropertyModel[] = [];
  public semanticMappings: ObjectPropertyModel[] = [];
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
      this.mService.queryBridgingConnectors(this.domainName).subscribe(
        (response) => {
          this.bridgingConnectors = response;
          console.log("Loading object properties");
        }
      );
    this.mService.querySemanticMappings(this.domainName).subscribe(
      (response) => {
        this.semanticMappings = response;
        console.log("Loading object properties");
      }
    );
      //}
    //);
    this.mService.queryDomainClasses();
    this.mService.queryModelingElementClasses();
    //this.mService.queryPaletteCategories();
    this.mService.queryNamespacePrefixes();

    this.currentPaletteElement.label = this.data.paletteElement.label;
    this.currentPaletteElement.thumbnailURL = this.data.paletteElement.thumbnailURL;
    console.log('this.data.paletteElement.thumbnailURL ' + this.data.paletteElement.thumbnailURL);
    console.log('this.data.paletteElement.imageURL ' + this.data.paletteElement.imageURL);
    console.log('this.data.paletteElement.comment ' + this.data.paletteElement.comment);
    console.log(this.data.paletteElement);
    this.currentPaletteElement.imageURL = this.data.paletteElement.imageURL;
    this.currentPaletteElement.comment = this.data.paletteElement.comment;
    this.currentPaletteElement.uuid = this.data.paletteElement.uuid;

    this.activityImageList = [
      {"imageURL":VariablesSettings.activitiesImagePath+"AdHoc_Subprocess.png", "imageName":"AdHoc_Subprocess.png", "label":"AdHoc Subprocess", "thumbnailURL":VariablesSettings.activitiesImagePath+"Thumbnail_AdHoc_Subprocess.png", "thumbnailName" : "Thumbnail_AdHoc_Subprocess.png"},
      {"imageURL":VariablesSettings.activitiesImagePath+"Business_Rule_Task.png", "imageName":"Business_Rule_Task.png", "label":"Business Rule Task", "thumbnailURL":VariablesSettings.activitiesImagePath+"Thumbnail_Business_Rule_Task.png", "thumbnailName" : "Thumbnail_Business_Rule_Task.png"},
      {"imageURL":VariablesSettings.activitiesImagePath+"Call_Activity.png", "imageName":"Call_Activity.png", "label":"Call Activity", "thumbnailURL":VariablesSettings.activitiesImagePath+"Thumbnail_Call_Activity.png", "thumbnailName" : "Thumbnail_Call_Activity.png"},
      {"imageURL":VariablesSettings.activitiesImagePath+"Collapsed_Subprocess.png", "imageName":"Collapsed_Subprocess.png", "label":"Collapsed Subprocess", "thumbnailURL":VariablesSettings.activitiesImagePath+"Thumbnail_Collapsed_Subprocess.png", "thumbnailName" : "Thumbnail_Collapsed_Subprocess.png"},
      {"imageURL":VariablesSettings.activitiesImagePath+"Discretionary_Task.png", "imageName":"Discretionary_Task.png", "label":"Discretionary Task", "thumbnailURL":VariablesSettings.activitiesImagePath+"Thumbnail_Discretionary_Task.png", "thumbnailName" : "Thumbnail_Discretionary_Task.png"},
      {"imageURL":VariablesSettings.activitiesImagePath+"KoGu.png", "imageName":"KoGu.png", "label":"KoGu", "thumbnailURL":VariablesSettings.activitiesImagePath+"Thumbnail_KoGu.png", "thumbnailName" : "Thumbnail_KoGu.png"},
      {"imageURL":VariablesSettings.activitiesImagePath+"KoGu_Stroke.png", "imageName":"KoGu_Stroke.png", "label":"KoGu Stroke", "thumbnailURL":VariablesSettings.activitiesImagePath+"Thumbnail_KoGu_Stroke.png", "thumbnailName" : "Thumbnail_KoGu_Stroke.png"},
      {"imageURL":VariablesSettings.activitiesImagePath+"Message_Task.png", "imageName":"Message_Task.png", "label":"Message Task", "thumbnailURL":VariablesSettings.activitiesImagePath+"Thumbnail_Message_Task.png", "thumbnailName" : "Thumbnail_Message_Task.png"},
      {"imageURL":VariablesSettings.activitiesImagePath+"Receive_Task.png", "imageName":"Receive_Task.png", "label":"Receive Task", "thumbnailURL":VariablesSettings.activitiesImagePath+"Thumbnail_Receive_Task.png", "thumbnailName" : "Thumbnail_Receive_Task.png"},
      {"imageURL":VariablesSettings.activitiesImagePath+"Send_Task.png", "imageName":"Send_Task.png", "label":"Send Task", "thumbnailURL":VariablesSettings.activitiesImagePath+"Thumbnail_Send_Task.png", "thumbnailName" : "Thumbnail_Send_Task.png"},
      {"imageURL":VariablesSettings.activitiesImagePath+"Service_Task.png", "imageName":"Service_Task.png", "label":"Service Task", "thumbnailURL":VariablesSettings.activitiesImagePath+"Thumbnail_Service_Task.png", "thumbnailName" : "Thumbnail_Service_Task.png"},
      {"imageURL":VariablesSettings.activitiesImagePath+"Subprocess.png", "imageName":"Subprocess.png", "label":"Subprocess", "thumbnailURL":VariablesSettings.activitiesImagePath+"Thumbnail_Subprocess.png", "thumbnailName" : "Thumbnail_Subprocess.png"},
      {"imageURL":VariablesSettings.activitiesImagePath+"Task.png", "imageName":"Task.png", "label":"Task", "thumbnailURL":VariablesSettings.activitiesImagePath+"Thumbnail_Task.png", "thumbnailName" : "Thumbnail_Task.png"},
      {"imageURL":VariablesSettings.activitiesImagePath+"User_Task.png", "imageName":"User_Task.png", "label":"User Task", "thumbnailURL":VariablesSettings.activitiesImagePath+"Thumbnail_User_Task.png", "thumbnailName" : "Thumbnail_User_Task.png"},
      {"imageURL":VariablesSettings.activitiesImagePath+"Manual_Task.png", "imageName":"Manual_Task.png", "label":"Manual Task", "thumbnailURL":VariablesSettings.activitiesImagePath+"Thumbnail_Manual_Task.png", "thumbnailName" : "Thumbnail_Manual_Task.png"}
    ];

    this.eventImageList = [
      {"imageURL":VariablesSettings.eventImagePath+"end_event.png", "imageName":"end_event.png", "label":"End Event", "thumbnailURL":VariablesSettings.eventImagePath+"end_event.png", "thumbnailName" : "end_event.png"},
      {"imageURL":VariablesSettings.eventImagePath+"intermediate_event.png", "imageName":"intermediate_event.png", "label":"Simple Intermediate", "thumbnailURL":VariablesSettings.eventImagePath+"intermediate_event.png", "thumbnailName" : "intermediate_event.png"},
      {"imageURL":VariablesSettings.eventImagePath+"start_event.png", "imageName":"Simple_Start.png", "label":"Simple Start", "thumbnailURL":VariablesSettings.eventImagePath+"Simple_Start.png", "thumbnailName" : "Simple_Start.png"},
      {"imageURL":VariablesSettings.eventImagePath+"Message_End.png", "imageName":"Message_End.png", "label":"Message End", "thumbnailURL":VariablesSettings.eventImagePath+"Message_End.png", "thumbnailName" : "Message_End.png"},
      {"imageURL":VariablesSettings.eventImagePath+"Message_Intermediate.png", "imageName":"Message_Intermediate.png", "label":"Message Intermediate", "thumbnailURL":VariablesSettings.eventImagePath+"Message_Intermediate.png", "thumbnailName" : "Message_Intermediate.png"},
      {"imageURL":VariablesSettings.eventImagePath+"Message_Start.png", "imageName":"Message_Start.png", "label":"Message Start", "thumbnailURL":VariablesSettings.eventImagePath+"Message_Start.png", "thumbnailName" : "Message_Start.png"},
      {"imageURL":VariablesSettings.eventImagePath+"Timer_Start.png", "imageName":"Timer_Start.png", "label":"Timer Start", "thumbnailURL":VariablesSettings.eventImagePath+"Timer_Start.png", "thumbnailName" : "Timer_Start.png"},
      {"imageURL":VariablesSettings.eventImagePath+"Timer_Intermediate.png", "imageName":"Timer_Intermediate.png", "label":"Timer Intermediate", "thumbnailURL":VariablesSettings.eventImagePath+"Timer_Intermediate.png", "thumbnailName" : "Timer_Intermediate.png"}
    ];

    this.gatewayImageList = [
      {"imageURL":VariablesSettings.gatewaysImagePath+"Simple_Gateway.png", "imageName":"Simple_Gateway.png", "label":"Simple Gateway", "thumbnailURL":VariablesSettings.gatewaysImagePath+"Simple_Gateway.png", "thumbnailName" : "Simple_Gateway.png"},
      {"imageURL":VariablesSettings.gatewaysImagePath+"EventBased_Gateway.png", "imageName":"EventBased_Gateway.png", "label":"Event Based Gateway", "thumbnailURL":VariablesSettings.gatewaysImagePath+"EventBased_Gateway.png", "thumbnailName" : "EventBased_Gateway.png"},
      {"imageURL":VariablesSettings.gatewaysImagePath+"Exclusive_Gateway.png", "imageName":"Exclusive_Gateway.png", "label":"Exclusive Gateway", "thumbnailURL":VariablesSettings.gatewaysImagePath+"Exclusive_Gateway.png", "thumbnailName" : "Exclusive_Gateway.png"},
      {"imageURL":VariablesSettings.gatewaysImagePath+"Parallel_Gateway.png", "imageName":"Parallel_Gateway.png", "label":"Parallel Gateway", "thumbnailURL":VariablesSettings.gatewaysImagePath+"Parallel_Gateway.png", "thumbnailName" : "Parallel_Gateway.png"}
    ];

    this.dataObjectImageList = [
      {"imageURL":VariablesSettings.dataObjectImagePath+"DataObject.png", "imageName":"DataObject.png", "label":"Data Object", "thumbnailURL":VariablesSettings.dataObjectImagePath+"DataObject.png", "thumbnailName" : "DataObject.png"},
      {"imageURL":VariablesSettings.dataObjectImagePath+"DataOutput.png", "imageName":"DataOutput.png", "label":"Data Output", "thumbnailURL":VariablesSettings.dataObjectImagePath+"DataOutput.png", "thumbnailName" : "DataOutput.png"},
      {"imageURL":VariablesSettings.dataObjectImagePath+"DataInput.png", "imageName":"DataInput.png", "label":"Data Input", "thumbnailURL":VariablesSettings.dataObjectImagePath+"DataInput.png", "thumbnailName" : "DataInput.png"},
      {"imageURL":VariablesSettings.dataObjectImagePath+"DataStore.png", "imageName":"DataStore.png", "label":"Data Store", "thumbnailURL":VariablesSettings.dataObjectImagePath+"DataStore.png", "thumbnailName" : "DataStore.png"}
    ];

    this.groupImageList = [
      {"imageURL":VariablesSettings.groupImagePath+"Group.jpg", "imageName":"Group.jpg", "label":"Group Large", "thumbnailURL":VariablesSettings.groupImagePath+"Group.jpg", "thumbnailName" : "Group.jpg"},
      {"imageURL":VariablesSettings.groupImagePath+"Group4Process.bmp", "imageName":"Group4Process.bmp", "label":"Group of Processes", "thumbnailURL":VariablesSettings.groupImagePath+"Group4Process.bmp", "thumbnailName" : "Group4Process.bmp"},
      {"imageURL":VariablesSettings.groupImagePath+"GroupOfAvtivities.png", "imageName":"GroupOfAvtivities.png", "label":"Group of Activities", "thumbnailURL":VariablesSettings.groupImagePath+"GroupOfAvtivities.png", "thumbnailName" : "GroupOfAvtivities.png"}
    ];

    this.sapscenesImageList = [
      {"imageURL":VariablesSettings.sapScenesImagePath+"Architecture.PNG", "imageName":"Architecture.PNG", "label":"Architecture", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_Architecture.PNG", "thumbnailName" : "Thumbnail_Architecture.PNG"},
      {"imageURL":VariablesSettings.sapScenesImagePath+"Window.PNG", "imageName":"Window.PNG", "label":"Window", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_Window.PNG", "thumbnailName" : "Thumbnail_Window.PNG"},
      {"imageURL":VariablesSettings.sapScenesImagePath+"CoffeeMachine.PNG", "imageName":"CoffeeMachine.PNG", "label":"Coffee Machine", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_CoffeeMachine.PNG", "thumbnailName" : "Thumbnail_CoffeeMachine.PNG"},
      {"imageURL":VariablesSettings.sapScenesImagePath+"Plants.PNG", "imageName":"Plants.PNG", "label":"Plants", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_Plants.PNG", "thumbnailName" : "Thumbnail_Plants.PNG"},
      {"imageURL":VariablesSettings.sapScenesImagePath+"PhotoFrame.PNG", "imageName":"PhotoFrame.PNG", "label":"Photo Frame", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_PhotoFrame.PNG", "thumbnailName" : "Thumbnail_PhotoFrame.PNG"},
      {"imageURL":VariablesSettings.sapScenesImagePath+"Lights.PNG", "imageName":"Lights.PNG", "label":"Lights", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_Lights.PNG", "thumbnailName" : "Thumbnail_Lights.PNG"},
      {"imageURL":VariablesSettings.sapScenesImagePath+"Television.PNG", "imageName":"Television.PNG", "label":"Television", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_Television.PNG", "thumbnailName" : "Thumbnail_Television.PNG"},
      {"imageURL":VariablesSettings.sapScenesImagePath+"Fan.PNG", "imageName":"Fan.PNG", "label":"Fan", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_Fan.PNG", "thumbnailName" : "Thumbnail_Fan.PNG"},
      {"imageURL":VariablesSettings.sapScenesImagePath+"Bed.PNG", "imageName":"Bed.PNG", "label":"Bed", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_Bed.PNG", "thumbnailName" : "Thumbnail_Bed.PNG"},
      {"imageURL":VariablesSettings.sapScenesImagePath+"ElectricAppliances.PNG", "imageName":"ElectricAppliances.PNG", "label":"Electric Appliances", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_ElectricAppliances.PNG", "thumbnailName" : "Thumbnail_ElectricAppliances.PNG"},
      {"imageURL":VariablesSettings.sapScenesImagePath+"Dishwasher.PNG", "imageName":"Dishwasher.PNG", "label":"Dishwasher", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_Dishwasher.PNG", "thumbnailName" : "Thumbnail_Dishwasher.PNG"},
      {"imageURL":VariablesSettings.sapScenesImagePath+"ExtractorHood.PNG", "imageName":"ExtractorHood.PNG", "label":"Extractor Hood", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_ExtractorHood.PNG", "thumbnailName" : "Thumbnail_ExtractorHood.PNG"},
      {"imageURL":VariablesSettings.sapScenesImagePath+"Heater.PNG", "imageName":"Heater.PNG", "label":"Heater", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_Heater.PNG", "thumbnailName" : "Thumbnail_Heater.PNG"},
      {"imageURL":VariablesSettings.sapScenesImagePath+"Cabinets.PNG", "imageName":"Cabinets.PNG", "label":"Cabinets", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_Cabinets.PNG", "thumbnailName" : "Thumbnail_Cabinets.PNG"},
      {"imageURL":VariablesSettings.sapScenesImagePath+"HighCabinet.PNG", "imageName":"HighCabinet.PNG", "label":"High Cabinet", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_HighCabinet.PNG", "thumbnailName" : "Thumbnail_HighCabinet.PNG"},
      {"imageURL":VariablesSettings.sapScenesImagePath+"WallCabinet.PNG", "imageName":"WallCabinet.PNG", "label":"Wall Cabinet", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_WallCabinet.PNG", "thumbnailName" : "Thumbnail_WallCabinet.PNG"},
      {"imageURL":VariablesSettings.sapScenesImagePath+"LowerCabinet.PNG", "imageName":"LowerCabinet.PNG", "label":"Lower Cabinet", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_LowerCabinet.PNG", "thumbnailName" : "Thumbnail_LowerCabinet.PNG"},
      {"imageURL":VariablesSettings.sapScenesImagePath+"HighCabinetForStorage.PNG", "imageName":"HighCabinetForStorage.PNG", "label":"High Cabinet For Storage", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_HighCabinetForStorage.PNG", "thumbnailName" : "Thumbnail_HighCabinetForStorage.PNG"},
      {"imageURL":VariablesSettings.sapScenesImagePath+"HighCabinetWithOven.PNG", "imageName":"HighCabinetWithOven.PNG", "label":"High Cabinet With Oven", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_HighCabinetWithOven.PNG", "thumbnailName" : "Thumbnail_HighCabinetWithOven.PNG"},
      {"imageURL":VariablesSettings.sapScenesImagePath+"WallCabinetWithGlass.PNG", "imageName":"WallCabinetWithGlass.PNG", "label":"Wall Cabinet With Glass", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_WallCabinetWithGlass.PNG", "thumbnailName" : "Thumbnail_WallCabinetWithGlass.PNG"},
      {"imageURL":VariablesSettings.sapScenesImagePath+"LowerCabinetWithCookingRange.PNG", "imageName":"LowerCabinetWithCookingRange.PNG", "label":"Lower Cabinet With Cooking Range", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_LowerCabinetWithCookingRange.PNG", "thumbnailName" : "Thumbnail_LowerCabinetWithCookingRange.PNG"},
      {"imageURL":VariablesSettings.sapScenesImagePath+"LowerCabinetWithShelves.PNG", "imageName":"LowerCabinetWithShelves.PNG", "label":"Lower Cabinet With Shelves", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_LowerCabinetWithShelves.PNG", "thumbnailName" : "Thumbnail_LowerCabinetWithShelves.PNG"},
      {"imageURL":VariablesSettings.sapScenesImagePath+"LowerCabinetWithSinkAndWasteDisposal.png", "imageName":"LowerCabinetWithSinkAndWasteDisposal.png", "label":"Lower Cabinet With Sink And Waste Disposal", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_LowerCabinetWithSinkAndWasteDisposal.PNG", "thumbnailName" : "Thumbnail_LowerCabinetWithSinkAndWasteDisposal.PNG"},
      {"imageURL":VariablesSettings.sapScenesImagePath+"DoubleDoorFridge.PNG", "imageName":"DoubleDoorFridge.PNG", "label":"Double Door Fridge", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_DoubleDoorFridge.PNG", "thumbnailName" : "Thumbnail_DoubleDoorFridge.PNG"},
      {"imageURL":VariablesSettings.sapScenesImagePath+"SingleDoorFridge.PNG", "imageName":"SingleDoorFridge.PNG", "label":"Single Door Fridge", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_SingleDoorFridge.PNG", "thumbnailName" : "Thumbnail_SingleDoorFridge.PNG"}
    ];

    this.sapscenesRelationsList = [
      {"imageURL":VariablesSettings.sapScenesImagePath+"BusinessWoman.PNG", "imageName":"BusinessWoman.PNG", "label":"Business Woman", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_BusinessWoman.PNG", "thumbnailName" : "Thumbnail_BusinessWoman.PNG"}
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

  openInsertNewSemanticMapping(element: PaletteElementModel) {

    const dialogRef1 = this.dialog.open(ModalInsertObjectPropertyComponent, {
      data: {paletteElement: element },
      height:'80%',
      width: '800px',
      disableClose: false,
    });

    const sub = dialogRef1.componentInstance.newRelationAdded.subscribe(() => {
      this.mService.querySemanticMappings(this.domainName).subscribe(
        (response) => {
          this.semanticMappings = response;
          dialogRef1.close('Cancel');
        }
      );
    });

    dialogRef1.afterClosed().subscribe(result => {
      console.log('The dialog was closed : ' + result);
    });
  }

  openInsertNewBridgingConnector(element: PaletteElementModel) {

    const dialogRef1 = this.dialog.open(ModalInsertLangobjectPropertyComponent, {
      data: {paletteElement: element },
      height:'80%',
      width: '800px',
      disableClose: false,
    });

    const sub = dialogRef1.componentInstance.newLangRelationAdded.subscribe(() => {
      this.mService.queryBridgingConnectors(this.domainName).subscribe(
        (response) => {
          this.bridgingConnectors = response;
          dialogRef1.close('Cancel');
        }
      );
    });

    dialogRef1.afterClosed().subscribe(result => {
      console.log('The dialog was closed : ' + result);
    });
  }

  modifyBridgingConnector(element: PaletteElementModel, property: ObjectPropertyModel) {
    const dialogRef1 = this.dialog.open(ModalEditBCObjectPropertyComponent, {
      data: {paletteElement: element, objectProperty: property },
      height:'80%',
      width: '800px',
      disableClose: false,
    });

    const sub = dialogRef1.componentInstance.bridgingConnectorEdited.subscribe(() => {
      //const prefix = this.namespaceMap.get(this.domainName);
      //const domainStr = prefix + ":" + this.domainNameArr[1];
      this.mService.queryBridgingConnectors(this.domainName).subscribe(
        (response) => {
          this.bridgingConnectors = response;
          dialogRef1.close('Cancel');
        }
      );

    });

    dialogRef1.afterClosed().subscribe(result => {
      console.log('The dialog was closed : ' + result);
    });
  }

  modifySemanticMapping(element: PaletteElementModel, property: ObjectPropertyModel) {
    const dialogRef1 = this.dialog.open(ModalEditSMObjectPropertyComponent, {
      data: {paletteElement: element, objectProperty: property },
      height:'80%',
      width: '800px',
      disableClose: false,
    });

    const sub = dialogRef1.componentInstance.semanticMappingEdited.subscribe(() => {
      //const prefix = this.namespaceMap.get(this.domainName);
      //const domainStr = prefix + ":" + this.domainNameArr[1];
      this.mService.querySemanticMappings(this.domainName).subscribe(
        (response) => {
          this.semanticMappings = response;
          dialogRef1.close('Cancel');
        }
      );

    });

    dialogRef1.afterClosed().subscribe(result => {
      console.log('The dialog was closed : ' + result);
    });
  }

  deleteSemanticMapping(property: ObjectPropertyModel) {
    this.mService.deleteObjectProperty(property).subscribe(
      (response) => {
        this.mService.querySemanticMappings(this.domainName).subscribe(
          (response1) => {
            this.semanticMappings = response1;
          }
        );

      }
    );
  }

  deleteBridgingConnector(property: ObjectPropertyModel) {
    this.mService.deleteObjectProperty(property).subscribe(
      (response) => {
        this.mService.queryBridgingConnectors(this.domainName).subscribe(
          (response1) => {
            this.bridgingConnectors = response1;
          }
        );

      }
    );
  }
}
