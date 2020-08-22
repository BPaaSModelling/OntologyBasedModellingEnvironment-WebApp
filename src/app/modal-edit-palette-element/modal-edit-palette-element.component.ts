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
import * as go from 'gojs';

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

  public documents4DSML4PTMImageList: any;
  public data4DSML4PTMImageList: any;
  public activities4DSML4PTMImageList:any;
  public connectors4DSML4PTMDocumentViewImageList:any;

  public group4BPaaSImageList: any;

  public organizationalUnitImageList: any;
  public performerImageList: any;
  public roleImageList: any;

  public sapscenesImageList: any;
  public sapscenesRelationsList: any;

  public domainName: string;
  //public domainNameArr = [];
  public namespaceMap: Map<string, string>;
  public datatypeProperties: DatatypePropertyModel[] = [];
  public bridgingConnectors: ObjectPropertyModel[] = [];
  public semanticMappings: ObjectPropertyModel[] = [];
  public config1: any;
  public VariablesSettings: any;

  public arrowHeads: string[] = [];


  constructor(public dialogRef: MatDialogRef<ModalEditPaletteElementComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, public mService: ModellerService, public dialog: MatDialog) {
    this.currentPaletteElement = new PaletteElementModel();
    this.namespaceMap = new Map<string, string>();
    //this.domainElement = new DomainElementModel();
    this.VariablesSettings = VariablesSettings;
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
    this.currentPaletteElement.arrowStroke = this.data.paletteElement.arrowStroke;
    this.currentPaletteElement.toArrow = this.data.paletteElement.toArrow;
    this.currentPaletteElement.fromArrow = this.data.paletteElement.fromArrow;

    this.activityImageList = [
      {"imageURL":VariablesSettings.activitiesImagePath+"AdHoc_Subprocess.png", "imageName":"AdHoc_Subprocess.png", "label":"AdHoc Subprocess", "thumbnailURL":VariablesSettings.activitiesImagePath+"Thumbnail_AdHoc_Subprocess.png", "thumbnailName" : "Thumbnail_AdHoc_Subprocess.png"},
      {"imageURL":VariablesSettings.activitiesImagePath+"Business_Rule_Task.png", "imageName":"Business_Rule_Task.png", "label":"Business Rule Task", "thumbnailURL":VariablesSettings.activitiesImagePath+"Thumbnail_Business_Rule_Task.png", "thumbnailName" : "Thumbnail_Business_Rule_Task.png"},
      {"imageURL":VariablesSettings.activitiesImagePath+"Call_Activity.png", "imageName":"Call_Activity.png", "label":"Call Activity", "thumbnailURL":VariablesSettings.activitiesImagePath+"Thumbnail_Call_Activity.png", "thumbnailName" : "Thumbnail_Call_Activity.png"},
      {"imageURL":VariablesSettings.activitiesImagePath+"Collapsed_Subprocess.png", "imageName":"Collapsed_Subprocess.png", "label":"Collapsed Subprocess", "thumbnailURL":VariablesSettings.activitiesImagePath+"Thumbnail_Collapsed_Subprocess.png", "thumbnailName" : "Thumbnail_Collapsed_Subprocess.png"},
      {"imageURL":VariablesSettings.activitiesImagePath+"Discretionary_Task.png", "imageName":"Discretionary_Task.png", "label":"Discretionary Task", "thumbnailURL":VariablesSettings.activitiesImagePath+"Thumbnail_Discretionary_Task.png", "thumbnailName" : "Thumbnail_Discretionary_Task.png"},
      {"imageURL":VariablesSettings.activitiesImagePath+"KoGu.png", "imageName":"KoGu.png", "label":"KoGu", "thumbnailURL":VariablesSettings.activitiesImagePath+"Thumbnail_KoGu.png", "thumbnailName" : "Thumbnail_KoGu.png"},
      {"imageURL":VariablesSettings.activitiesImagePath+"KoGu_Stroke.png", "imageName":"KoGu_Stroke.png", "label":"KoGu Stroke", "thumbnailURL":VariablesSettings.activitiesImagePath+"Thumbnail_KoGu_Stroke.png", "thumbnailName" : "Thumbnail_KoGu_Stroke.png"},
      {"imageURL":VariablesSettings.activitiesImagePath+"Message_Task.png", "imageName":"Message_Task.png", "label":"Message Task", "thumbnailURL":VariablesSettings.activitiesImagePath+"Thumbnail_Message_Task.png", "thumbnailName" : "Thumbnail_Message_Task.png"},
      {"imageURL":VariablesSettings.activitiesImagePath+"Receive_Task.png", "imageName":"Receive_Task.png", "label":"Receive Message Task", "thumbnailURL":VariablesSettings.activitiesImagePath+"Thumbnail_Receive_Task.png", "thumbnailName" : "Thumbnail_Receive_Task.png"},
      {"imageURL":VariablesSettings.activitiesImagePath+"Send_Task.png", "imageName":"Send_Task.png", "label":"Send Message Task", "thumbnailURL":VariablesSettings.activitiesImagePath+"Thumbnail_Send_Task.png", "thumbnailName" : "Thumbnail_Send_Task.png"},
      {"imageURL":VariablesSettings.activitiesImagePath+"Service_Task.png", "imageName":"Service_Task.png", "label":"Service Task", "thumbnailURL":VariablesSettings.activitiesImagePath+"Thumbnail_Service_Task.png", "thumbnailName" : "Thumbnail_Service_Task.png"},
      {"imageURL":VariablesSettings.activitiesImagePath+"Subprocess.png", "imageName":"Subprocess.png", "label":"Subprocess", "thumbnailURL":VariablesSettings.activitiesImagePath+"Thumbnail_Subprocess.png", "thumbnailName" : "Thumbnail_Subprocess.png"},
      {"imageURL":VariablesSettings.activitiesImagePath+"Task.png", "imageName":"Task.png", "label":"Task", "thumbnailURL":VariablesSettings.activitiesImagePath+"Thumbnail_Task.png", "thumbnailName" : "Thumbnail_Task.png"},
      {"imageURL":VariablesSettings.activitiesImagePath+"User_Task.png", "imageName":"User_Task.png", "label":"User Task", "thumbnailURL":VariablesSettings.activitiesImagePath+"Thumbnail_User_Task.png", "thumbnailName" : "Thumbnail_User_Task.png"},
      {"imageURL":VariablesSettings.activitiesImagePath+"Business_Rule_Task.png", "imageName":"Business_Rule_Task.png", "label":"Business Rule Task", "thumbnailURL":VariablesSettings.activitiesImagePath+"Thumbnail_Business_Rule_Task.png", "thumbnailName" : "Thumbnail_Business_Rule_Task.png"},
      {"imageURL":VariablesSettings.activitiesImagePath+"Script_Task.png", "imageName":"Script_Task.png", "label":"Script Task", "thumbnailURL":VariablesSettings.activitiesImagePath+"Thumbnail_Script_Task.png", "thumbnailName" : "Thumbnail_Script_Task.png"},
      {"imageURL":VariablesSettings.activitiesImagePath+"PaymentTask.png", "imageName":"PaymentTask.png", "label":"Payment Task", "thumbnailURL":VariablesSettings.activitiesImagePath+"Thumbnail_PaymentTask.png", "thumbnailName" : "Thumbnail_PaymentTask.png"},
      {"imageURL":VariablesSettings.activitiesImagePath+"Manual_Task.png", "imageName":"Manual_Task.png", "label":"Manual Task", "thumbnailURL":VariablesSettings.activitiesImagePath+"Thumbnail_Manual_Task.png", "thumbnailName" : "Thumbnail_Manual_Task.png"},
      {"imageURL":VariablesSettings.activitiesImagePath+"CloudTask.png", "imageName":"CloudTask.png", "label":"Cloud Task", "thumbnailURL":VariablesSettings.activitiesImagePath+"Thumbnail_CloudTask.png", "thumbnailName" : "Thumbnail_CloudTask.png"},
      {"imageURL":VariablesSettings.activitiesImagePath+"CloudService.png", "imageName":"CloudService.png", "label":"Cloud Service", "thumbnailURL":VariablesSettings.activitiesImagePath+"Thumbnail_CloudService.png", "thumbnailName" : "Thumbnail_CloudService.png"}
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
      {"imageURL":VariablesSettings.groupImagePath+"GroupOfAvtivities.png", "imageName":"GroupOfAvtivities.png", "label":"Group of Activities", "thumbnailURL":VariablesSettings.groupImagePath+"GroupOfAvtivities.png", "thumbnailName" : "GroupOfAvtivities.png"},
      {"imageURL":VariablesSettings.groupImagePath+"Group_ManagingCR.jpg", "imageName":"Group_ManagingCR.jpg", "label":"Managing Customer Relationship", "thumbnailURL":VariablesSettings.groupImagePath+"Group_ManagingCR.jpg", "thumbnailName" : "Group_ManagingCR.jpg"},
      {"imageURL":VariablesSettings.groupImagePath+"Group_TransmittingBillData.jpg", "imageName":"Group_TransmittingBillData.jpg", "label":"Transmitting Billing Data", "thumbnailURL":VariablesSettings.groupImagePath+"Group_TransmittingBillData.jpg", "thumbnailName" : "Group_TransmittingBillData.jpg"},
      {"imageURL":VariablesSettings.groupImagePath+"Group_GeneratingCustBillData.jpg", "imageName":"Group_GeneratingCustBillData.jpg", "label":"Generating Customer Billing Data", "thumbnailURL":VariablesSettings.groupImagePath+"Group_GeneratingCustBillData.jpg", "thumbnailName" : "Group_GeneratingCustBillData.jpg"}
    ];

    this.documents4DSML4PTMImageList = [
      {"imageURL":VariablesSettings.documents4DSML4PTMImagePath+"ICFstandard-dkm.png", "imageName":"ICFstandard-dkm.png", "label":"ICF Standard", "thumbnailURL":VariablesSettings.documents4DSML4PTMImagePath+"ICFstandard-dkm.png", "thumbnailName" : "ICFstandard-dkm.png"},
      {"imageURL":VariablesSettings.documents4DSML4PTMImagePath+"KoGuStrokeDocument-dkm.png", "imageName":"KoGuStrokeDocument-dkm.png", "label":"KoGu Stroke Document", "thumbnailURL":VariablesSettings.documents4DSML4PTMImagePath+"KoGuStrokeDocument-dkm.png", "thumbnailName" : "KoGuStrokeDocument-dkm.png"},
      {"imageURL":VariablesSettings.documents4DSML4PTMImagePath+"MedicationList-dkm.png", "imageName":"MedicationList-dkm.png", "label":"ICF Document", "thumbnailURL":VariablesSettings.documents4DSML4PTMImagePath+"MedicationList-dkm.png", "thumbnailName" : "MedicationList-dkm.png"}
    ];

    this.data4DSML4PTMImageList = [
      {"imageURL":VariablesSettings.data4DSML4PTMImagePath+"KoGu.png", "imageName":"KoGu.png", "label":"KoGu Data Object", "thumbnailURL":VariablesSettings.data4DSML4PTMImagePath+"KoGu.png", "thumbnailName" : "KoGu.png"},
      {"imageURL":VariablesSettings.data4DSML4PTMImagePath+"KoGu_Stroke.png", "imageName":"KoGu_Stroke.png", "label":"KoGu Stroke Data Object", "thumbnailURL":VariablesSettings.data4DSML4PTMImagePath+"KoGu_Stroke.png", "thumbnailName" : "KoGu_Stroke.png"}
    ];

    this.activities4DSML4PTMImageList = [
      {"imageURL":VariablesSettings.activities4DSML4PTMImagePath+"Prepare_CostReimbursement.png", "imageName":"Prepare_CostReimbursement.png", "label":"Prepare Cost Reimbursement", "thumbnailURL":VariablesSettings.activities4DSML4PTMImagePath+"Prepare_CostReimbursement.png", "thumbnailName" : "Prepare_CostReimbursement.png"},
      {"imageURL":VariablesSettings.activities4DSML4PTMImagePath+"Finalize_KoGu.png", "imageName":"Finalize_KoGu.png", "label":"Finalize Cost Reimbursement", "thumbnailURL":VariablesSettings.activities4DSML4PTMImagePath+"Finalize_KoGu.png", "thumbnailName" : "Finalize_KoGu.png"}
    ];

    this.connectors4DSML4PTMDocumentViewImageList = [
      {"imageURL":VariablesSettings.connectors4Document4DSML4PTMImagePath+"belongsTo-dkm.png", "imageName":"belongsTo-dkm.png", "label":"Belongs to", "thumbnailURL":VariablesSettings.connectors4Document4DSML4PTMImagePath+"Thumbnail_belongsTo-dkm.png", "thumbnailName" : "Thumbnail_belongsTo-dkm.png"},
      {"imageURL":VariablesSettings.connectors4Document4DSML4PTMImagePath+"hasSubDocument-dkm.png", "imageName":"hasSubDocument-dkm.png", "label":"Has Sub-Document", "thumbnailURL":VariablesSettings.connectors4Document4DSML4PTMImagePath+"Thumbnail_hasSubDocument-dkm.png", "thumbnailName" : "Thumbnail_hasSubDocument-dkm.png"}
    ];

    this.group4BPaaSImageList = [
      {"imageURL":VariablesSettings.group4BPaaSImagePath+"Group.jpg", "imageName":"Group.jpg", "label":"Group", "thumbnailURL":VariablesSettings.group4BPaaSImagePath+"Group.jpg", "thumbnailName" : "Group.jpg"},
      {"imageURL":VariablesSettings.group4BPaaSImagePath+"Group_ManagingCR.jpg", "imageName":"Group_ManagingCR.jpg", "label":"Managing Customer Relationship", "thumbnailURL":VariablesSettings.group4BPaaSImagePath+"Group_ManagingCR.jpg", "thumbnailName" : "Group_ManagingCR.jpg"},
      {"imageURL":VariablesSettings.group4BPaaSImagePath+"Group_TransmittingBillData.jpg", "imageName":"Group_TransmittingBillData.jpg", "label":"Transmitting Billing Data", "thumbnailURL":VariablesSettings.group4BPaaSImagePath+"Group_TransmittingBillData.jpg", "thumbnailName" : "Group_TransmittingBillData.jpg"},
      {"imageURL":VariablesSettings.group4BPaaSImagePath+"Group_GeneratingCustBillData.jpg", "imageName":"Group_GeneratingCustBillData.jpg", "label":"Generating Customer Billing Data", "thumbnailURL":VariablesSettings.group4BPaaSImagePath+"Group_GeneratingCustBillData.jpg", "thumbnailName" : "Group_GeneratingCustBillData.jpg"}
    ];

    this.organizationalUnitImageList = [
      {"imageURL":VariablesSettings.organizationalUnitImagePath+"OrganizationalUnitAcuteHospital-OM.png", "imageName":"OrganizationalUnitAcuteHospital-OM.png", "label":"Acute Hospital", "thumbnailURL":VariablesSettings.organizationalUnitImagePath+"OrganizationalUnitAcuteHospital-OM.png", "thumbnailName" : "OrganizationalUnitAcuteHospital-OM.png"},
      {"imageURL":VariablesSettings.organizationalUnitImagePath+"OrganizationalUnitRehabilitationClinic-OM.png", "imageName":"OrganizationalUnitRehabilitationClinic-OM.png", "label":"Rehab Clinic", "thumbnailURL":VariablesSettings.organizationalUnitImagePath+"OrganizationalUnitRehabilitationClinic-OM.png", "thumbnailName" : "OrganizationalUnitRehabilitationClinic-OM.png"}
    ];

    this.performerImageList = [
      {"imageURL":VariablesSettings.performerImagePath+"Performer-OM.png", "imageName":"Performer-OM.png", "label":"Performer", "thumbnailURL":VariablesSettings.performerImagePath+"Performer-OM.png", "thumbnailName" : "Performer-OM.png"}
    ];

    this.roleImageList = [
      {"imageURL":VariablesSettings.roleImagePath+"RoleAcutePhysician-OM.png", "imageName":"RoleAcutePhysician-OM.png", "label":"Acute Physician", "thumbnailURL":VariablesSettings.roleImagePath+"RoleAcutePhysician-OM.png", "thumbnailName" : "RoleAcutePhysician-OM.png"},
      {"imageURL":VariablesSettings.roleImagePath+"RolePatient-OM.png", "imageName":"RolePatient-OM.png", "label":"Patient", "thumbnailURL":VariablesSettings.roleImagePath+"RolePatient-OM.png", "thumbnailName" : "RolePatient-OM.png"}
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
      {"imageURL":VariablesSettings.sapScenesImagePath+"SingleDoorFridge.PNG", "imageName":"SingleDoorFridge.PNG", "label":"Single Door Fridge", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_SingleDoorFridge.PNG", "thumbnailName" : "Thumbnail_SingleDoorFridge.PNG"},
      {"imageURL":VariablesSettings.sapScenesImagePath+"Basket1.png", "imageName":"Basket1.png", "label":"Basket1", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_Basket1.png", "thumbnailName" : "Thumbnail_Basket1.png"},
      {"imageURL":VariablesSettings.sapScenesImagePath+"Basket2.png", "imageName":"Basket2.png", "label":"Basket2", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_Basket2.png", "thumbnailName" : "Thumbnail_Basket2.png"},
      {"imageURL":VariablesSettings.sapScenesImagePath+"Basket3.png", "imageName":"Basket3.png", "label":"Basket3", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_Basket3.png", "thumbnailName" : "Thumbnail_Basket3.png"},
      {"imageURL":VariablesSettings.sapScenesImagePath+"Basket4.png", "imageName":"Basket4.png", "label":"Basket4", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_Basket4.png", "thumbnailName" : "Thumbnail_Basket4.png"},
      {"imageURL":VariablesSettings.sapScenesImagePath+"CreditCard1.png", "imageName":"CreditCard1.png", "label":"Credit Card1", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_CreditCard1.png", "thumbnailName" : "Thumbnail_CreditCard1.png"},
      {"imageURL":VariablesSettings.sapScenesImagePath+"CreditCard2.png", "imageName":"CreditCard2.png", "label":"Credit Card2", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_CreditCard2.png", "thumbnailName" : "Thumbnail_CreditCard2.png"},
      {"imageURL":VariablesSettings.sapScenesImagePath+"Paypal.png", "imageName":"Paypal.png", "label":"Paypal", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_Paypal.png", "thumbnailName" : "Thumbnail_Paypal.png"},
      {"imageURL":VariablesSettings.sapScenesImagePath+"CreditCard2.png", "imageName":"CreditCard2.png", "label":"Credit Card2", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_CreditCard2.png", "thumbnailName" : "Thumbnail_CreditCard2.png"},
      {"imageURL":VariablesSettings.sapScenesImagePath+"ShoppingCart1.png", "imageName":"ShoppingCart1.png", "label":"Shopping Cart1", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_ShoppingCart1.png", "thumbnailName" : "Thumbnail_ShoppingCart1.png"},
      {"imageURL":VariablesSettings.sapScenesImagePath+"ShoppingCart3.png", "imageName":"ShoppingCart3.png", "label":"Shopping Cart3", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_ShoppingCart3.png", "thumbnailName" : "Thumbnail_ShoppingCart3.png"},
      {"imageURL":VariablesSettings.sapScenesImagePath+"ShoppingCart2.png", "imageName":"ShoppingCart2.png", "label":"Shopping Cart2", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_ShoppingCart2.png", "thumbnailName" : "Thumbnail_ShoppingCart2.png"},
      {"imageURL":VariablesSettings.sapScenesImagePath+"ShoppingCart.PNG", "imageName":"ShoppingCart.PNG", "label":"Shopping Cart", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_ShoppingCart.PNG", "thumbnailName" : "Thumbnail_ShoppingCart.PNG"},
      {"imageURL":VariablesSettings.sapScenesImagePath+"Money1.png", "imageName":"Money1.png", "label":"Money1", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_Money1.png", "thumbnailName" : "Thumbnail_Money1.png"},
      {"imageURL":VariablesSettings.sapScenesImagePath+"money2.png", "imageName":"money2.png", "label":"Money2", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_Money2.png", "thumbnailName" : "Thumbnail_Money2.png"},
      {"imageURL":VariablesSettings.sapScenesImagePath+"Wallet1.png", "imageName":"Wallet1.png", "label":"Wallet1", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Wallet1.png", "thumbnailName" : "Thumbnail_Wallet1.png"},
      {"imageURL":VariablesSettings.sapScenesImagePath+"wallet2.png", "imageName":"Wallet2.png", "label":"Wallet2", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_Wallet2.png", "thumbnailName" : "Thumbnail_Wallet2.png"},
      {"imageURL":VariablesSettings.sapScenesImagePath+"wallet3.png", "imageName":"Wallet3.png", "label":"Wallet3", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_Wallet3.png", "thumbnailName" : "Thumbnail_Wallet3.png"},
      {"imageURL":VariablesSettings.sapScenesImagePath+"RobotArm.PNG", "imageName":"RobotArm.PNG", "label":"Robot Arm", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_RobotArm.PNG", "thumbnailName" : "Thumbnail_RobotArm.PNG"},
      {"imageURL":VariablesSettings.sapScenesImagePath+"Building.PNG", "imageName":"Building.PNG", "label":"Building", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_Building.PNG", "thumbnailName" : "Thumbnail_Building.PNG"},
      {"imageURL":VariablesSettings.sapScenesImagePath+"CoffeeCup.PNG", "imageName":"CoffeeCup.PNG", "label":"Coffee Cup", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_CoffeeCup.PNG", "thumbnailName" : "Thumbnail_CoffeeCup.PNG"},
      {"imageURL":VariablesSettings.sapScenesImagePath+"CoffeeMachine.PNG", "imageName":"CoffeeMachine.PNG", "label":"Coffee Machine", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_CoffeeMachine.PNG", "thumbnailName" : "Thumbnail_CoffeeMachine.PNG"},
      {"imageURL":VariablesSettings.sapScenesImagePath+"kiosk1.png", "imageName":"kiosk1.png", "label":"Kiosk1", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_kiosk1.png", "thumbnailName" : "Thumbnail_kiosk1.png"},
      {"imageURL":VariablesSettings.sapScenesImagePath+"kiosk2.png", "imageName":"kiosk2.png", "label":"Kiosk2", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_kiosk2.png", "thumbnailName" : "Thumbnail_kiosk2.png"},
      {"imageURL":VariablesSettings.sapScenesImagePath+"journal1.png", "imageName":"journal1.png", "label":"Journal1", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_journal1.png", "thumbnailName" : "Thumbnail_journal1.png"},
      {"imageURL":VariablesSettings.sapScenesImagePath+"journal2.png", "imageName":"journal2.png", "label":"Journal2", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_journal2.png", "thumbnailName" : "Thumbnail_journal2.png"},
      {"imageURL":VariablesSettings.sapScenesImagePath+"journal3.png", "imageName":"journal3.png", "label":"Journal3", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_journal3.png", "thumbnailName" : "Thumbnail_journal3.png"},
      {"imageURL":VariablesSettings.sapScenesImagePath+"journal4.png", "imageName":"journal4.png", "label":"Journal4", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_journal4.png", "thumbnailName" : "Thumbnail_journal4.png"},
      {"imageURL":VariablesSettings.sapScenesImagePath+"beer1.png", "imageName":"beer1.png", "label":"Beer1", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_beer1.png", "thumbnailName" : "Thumbnail_beer1.png"},
      {"imageURL":VariablesSettings.sapScenesImagePath+"beer2.png", "imageName":"beer2.png", "label":"Beer2", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_beer2.png", "thumbnailName" : "Thumbnail_beer2.png"},
      {"imageURL":VariablesSettings.sapScenesImagePath+"beer3.png", "imageName":"beer3.png", "label":"Beer3", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_beer3.png", "thumbnailName" : "Thumbnail_beer3.png"}
    ];

    this.sapscenesRelationsList = [
      {"imageURL":VariablesSettings.sapScenesImagePath+"Thumbnail_Executes.PNG", "imageName":"Thumbnail_Executes.PNG", "label":"Executes", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_Executes.PNG", "thumbnailName" : "Thumbnail_Executes.PNG"},
      {"imageURL":VariablesSettings.sapScenesImagePath+"Thumbnail_hasNote.PNG", "imageName":"Thumbnail_hasNote.PNG", "label":"Has Note", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_hasNote.PNG", "thumbnailName" : "Thumbnail_hasNote.PNG"},
      {"imageURL":VariablesSettings.sapScenesImagePath+"Thumbnail_hasRelation.PNG", "imageName":"Thumbnail_hasRelation.PNG", "label":"Has Relation", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_hasRelation.PNG", "thumbnailName" : "Thumbnail_hasRelation.PNG"}
    ];

    this.mService.getArrowStructures().then(value => {
      this.arrowHeads = value;
    });

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
