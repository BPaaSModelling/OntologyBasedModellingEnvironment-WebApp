import {Component, Inject, OnInit, Output, EventEmitter} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog} from "@angular/material";
import {DomainElementModel} from "../_models/DomainElement.model";
import {ModellerService} from "../modeller.service";
import {PaletteElementModel} from "../_models/PaletteElement.model";
import {ModalCreateDomainElementsComponent} from "../modal-create-domain-elements/modal-create-domain-elements.component";
import {ModalAddPropertiesComponent} from "../modal-add-properties/modal-add-properties.component";
import {VariablesSettings} from "../_settings/variables.settings";

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
public activityImageList: any;
public eventImageList: any;
public gatewayImageList: any;
public dataObjectImageList: any;
public groupImageList: any;

public sapscenesImageList: any;
public sapscenesRelationsList: any;

public config: any;
public config1: any;
public VariablesSettings: any;


@Output() showCreateDomainElementModalFromExtend = new EventEmitter();
@Output() newElementCreated = new EventEmitter();
  constructor(
    public dialogRef: MatDialogRef<ModalExtendPaletteElementComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public mService: ModellerService, public dialog: MatDialog) {
    this.currentPaletteElement = new PaletteElementModel();
    this.VariablesSettings = VariablesSettings;
  }


  ngOnInit() {
    this.mService.queryDomainClasses();
    this.mService.queryModelingElementClasses();
    //this.mService.queryPaletteCategories();
    this.mService.queryNamespacePrefixes();

    console.log('Palette category for the element is" '+ this.data.paletteElement.categoryLabel);
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
      {"imageURL":VariablesSettings.activitiesImagePath+"PaymentTask.png", "imageName":"PaymentTask.png", "label":"Payment Task", "thumbnailURL":VariablesSettings.activitiesImagePath+"Thumbnail_PaymentTask.png, "thumbnailName" : "Thumbnail_PaymentTask.png"},
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
      {"imageURL":VariablesSettings.sapScenesImagePath+"SingleDoorFridge.PNG", "imageName":"SingleDoorFridge.PNG", "label":"Single Door Fridge", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_SingleDoorFridge.PNG", "thumbnailName" : "Thumbnail_SingleDoorFridge.PNG"},
      {"imageURL":VariablesSettings.sapScenesImagePath+"basket1.png", "imageName":"basket1.png", "label":"Basket1", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_basket1.png", "thumbnailName" : "Thumbnail_basket1.png"},
      {"imageURL":VariablesSettings.sapScenesImagePath+"Basket2.png", "imageName":"Basket2.png", "label":"Basket2", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_Basket2.png, "thumbnailName" : "Thumbnail_Basket2.png"},
      {"imageURL":VariablesSettings.sapScenesImagePath+"Basket3.png", "imageName":"Basket3.png", "label":"Basket3", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_Basket3.png, "thumbnailName" : "Thumbnail_Basket3.png"},
      {"imageURL":VariablesSettings.sapScenesImagePath+"Basket4.png", "imageName":"Basket4.png", "label":"Basket4", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_Basket4.png, "thumbnailName" : "Thumbnail_Basket4.png"},
      {"imageURL":VariablesSettings.sapScenesImagePath+"CreditCard1.png", "imageName":"CreditCard1.png", "label":"Credit Card1", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_CreditCard1.png, "thumbnailName" : "Thumbnail_CreditCard1.png"},
      {"imageURL":VariablesSettings.sapScenesImagePath+"CreditCard2.png", "imageName":"CreditCard2.png", "label":"Credit Card2", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_CreditCard2.png, "thumbnailName" : "Thumbnail_CreditCard2.png"},
      {"imageURL":VariablesSettings.sapScenesImagePath+"Paypal.png", "imageName":"Paypal.png", "label":"Paypal", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_Paypal.png, "thumbnailName" : "Thumbnail_Paypal.png"},
      {"imageURL":VariablesSettings.sapScenesImagePath+"CreditCard2.png", "imageName":"CreditCard2.png", "label":"Credit Card2", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_CreditCard2.png, "thumbnailName" : "Thumbnail_CreditCard2.png"},
      {"imageURL":VariablesSettings.sapScenesImagePath+"ShoopingCart1.png", "imageName":"ShoopingCart1.png", "label":"Shooping Cart1", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_ShoopingCart1.png, "thumbnailName" : "Thumbnail_ShoopingCart1.png"},
      {"imageURL":VariablesSettings.sapScenesImagePath+"ShoppingCart3.png", "imageName":"ShoppingCart3.png", "label":"Shopping Cart3", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_ShoppingCart3.png, "thumbnailName" : "Thumbnail_ShoppingCart3.png"},
      {"imageURL":VariablesSettings.sapScenesImagePath+"ShoppingCart2.png", "imageName":"ShoppingCart2.png", "label":"Shopping Cart2", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_ShoppingCart2.png, "thumbnailName" : "Thumbnail_ShoppingCart2.png"},
      {"imageURL":VariablesSettings.sapScenesImagePath+"ShoppingCart.PNG", "imageName":"ShoppingCart.PNG", "label":"Shopping Cart", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_ShoppingCart.PNG, "thumbnailName" : "Thumbnail_ShoppingCart.PNG"},
      {"imageURL":VariablesSettings.sapScenesImagePath+"Money1.png", "imageName":"Money1.png", "label":"Money1", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_Money1.png, "thumbnailName" : "Thumbnail_Money1.png"},
      {"imageURL":VariablesSettings.sapScenesImagePath+"money2.png", "imageName":"money2.png", "label":"Money2", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_Money2.png, "thumbnailName" : "Thumbnail_Money2.png"},
      {"imageURL":VariablesSettings.sapScenesImagePath+"Wallet1.png", "imageName":"Wallet1.png", "label":"Wallet1", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Wallet1.png, "thumbnailName" : "Thumbnail_Wallet1.png"},
      {"imageURL":VariablesSettings.sapScenesImagePath+"Wallet2.png", "imageName":"Wallet2.png", "label":"Wallet2", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_Wallet2.png, "thumbnailName" : "Thumbnail_Wallet2.png"},
      {"imageURL":VariablesSettings.sapScenesImagePath+"Wallet3.png", "imageName":"Wallet3.png", "label":"Wallet3", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_Wallet3.png, "thumbnailName" : "Thumbnail_Wallet3.png"},
      {"imageURL":VariablesSettings.sapScenesImagePath+"RobotArm.PNG", "imageName":"RobotArm.PNG", "label":"Robot Arm", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_RobotArm.PNG, "thumbnailName" : "Thumbnail_RobotArm.PNG"},
      {"imageURL":VariablesSettings.sapScenesImagePath+"Building.PNG", "imageName":"Building.PNG", "label":"Building", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_Building.PNG, "thumbnailName" : "Thumbnail_Building.PNG"},
      {"imageURL":VariablesSettings.sapScenesImagePath+"CoffeeCup.PNG", "imageName":"CoffeeCup.PNG", "label":"Coffee Cup", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_CoffeeCup.PNG, "thumbnailName" : "Thumbnail_CoffeeCup.PNG"},
      {"imageURL":VariablesSettings.sapScenesImagePath+"CoffeeMachine.PNG", "imageName":"CoffeeMachine.PNG", "label":"Coffee Machine", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_CoffeeMachine.PNG, "thumbnailName" : "Thumbnail_CoffeeMachine.PNG"}


    ];

    this.sapscenesRelationsList = [
      {"imageURL":VariablesSettings.sapScenesImagePath+"Thumbnail_Executes.PNG", "imageName":"Thumbnail_Executes.PNG", "label":"Executes", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_Executes.PNG", "thumbnailName" : "Thumbnail_Executes.PNG"},
      {"imageURL":VariablesSettings.sapScenesImagePath+"Thumbnail_hasNote.PNG", "imageName":"Thumbnail_hasNote.PNG", "label":"Has Note", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_hasNote.PNG", "thumbnailName" : "Thumbnail_hasNote.PNG"},
      {"imageURL":VariablesSettings.sapScenesImagePath+"Thumbnail_hasRelation.PNG", "imageName":"Thumbnail_hasRelation.PNG", "label":"Has Relation", "thumbnailURL":VariablesSettings.sapScenesImagePath+"Thumbnail_hasRelation.PNG", "thumbnailName" : "Thumbnail_hasRelation.PNG"}
    ];

    this.config = {
      displayKey: 'label', //if objects array passed which key to be displayed defaults to description
      search: true, //true/false for the search functionlity defaults to false,
      height: 'auto', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
      placeholder: 'Select Semantic Domain Element', // text to be displayed when no item is selected defaults to Select,
      // customComparator: ()=>{} // a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
      limitTo: 5, // a number thats limits the no of options displayed in the UI similar to angular's limitTo pipe
      moreText: 'more', // text to be displayed whenmore than one items are selected like Option 1 + 5 more
      noResultsFound: 'No results found!', // text to be displayed when no items are found while searching
      searchPlaceholder: 'Search' // label thats displayed in search input,
      // searchOnKey: 'name' // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
    };

    this.config1 = {
      displayKey: 'label', //if objects array passed which key to be displayed defaults to description
      search: true, //true/false for the search functionlity defaults to false,
      height: 'auto', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
      placeholder: 'Select Existing Language Element', // text to be displayed when no item is selected defaults to Select,
      // customComparator: ()=>{} // a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
      limitTo: 5, // a number thats limits the no of options displayed in the UI similar to angular's limitTo pipe
      moreText: 'more', // text to be displayed whenmore than one items are selected like Option 1 + 5 more
      noResultsFound: 'No results found!', // text to be displayed when no items are found while searching
      searchPlaceholder: 'Search' // label thats displayed in search input,
    };
  }

  onCloseCancel() {
    this.dialogRef.close('Cancel');
  }

  selectionChanged($event: any) {
    console.log('Selection changed');
    this.currentPaletteElement.representedDomainClass = $event.value.id;
  }

  selectionChangedForIntegrate($event: any) {
    console.log('Selection changed for Integrate Elements');
    //this.data.paletteElement.languageSubclasses = $event.value.id;
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
    ele.parentLanguageClass = this.data.paletteElement.representedLanguageClass;
    console.log('parent:' + ele.parentElement);
    ele.paletteCategory = this.data.paletteElement.paletteCategory; // 'lo:Category_Activities';
    console.log('category: ' + this.currentPaletteElement.paletteCategory);
    ele.representedLanguageClass = ele.languagePrefix + (this.currentPaletteElement.label).replace(new RegExp(' ', 'g'), ''); /*important property to display in the pallette*/

    console.log('Thumbnail not selected: ' + this.currentPaletteElement.thumbnailURL);
    ele.width = 100;
    ele.height = 70;
    // Set width and height of the image as per category
    if (ele.paletteCategory.search(VariablesSettings.CAT_ACTIVITIES) !== -1) {
      ele.width = 100;
      ele.height = 70;
      if (this.currentPaletteElement.thumbnailURL === null) {
        ele.thumbnailURL = '/assets/images/BPMN-CMMN/Thumbnail_Task.png';
      }
    } else if (ele.paletteCategory.search(VariablesSettings.CAT_EVENTS) !== -1) {
      ele.width = 70;
      ele.height = 70;
      if (this.currentPaletteElement.thumbnailURL === null) {
        ele.thumbnailURL = '/assets/images/BPMN-CMMN/Simple_Start.png';
      }
    } else if (ele.paletteCategory.search(VariablesSettings.CAT_GATEWAYS) !== -1) {
      ele.width = 70;
      ele.height = 100;
      if (this.currentPaletteElement.thumbnailURL === null) {
        ele.thumbnailURL = '/assets/images/BPMN-CMMN/Simple_Gateway.png';
      }
    } else if (ele.paletteCategory.search(VariablesSettings.CAT_DATA) !== -1) {
      ele.width = 70;
      ele.height = 100;
    }

    console.log('stringified element:' + JSON.stringify(ele));


    this.mService.createElementInOntology(JSON.stringify(ele)).subscribe( // this is a synchronous call to the webservice
      (response) => {
        this.newElementCreated.emit(ele);
        this.dialogRef.close();

        const dialogRef1 = this.dialog.open(ModalAddPropertiesComponent, {
          data: {paletteElement: ele },
          height:'80%',
          width: '800px',
          disableClose: false,
        });

        this.mService.queryPaletteElements();

        const sub = dialogRef1.componentInstance.propertiesAdded.subscribe(() => {
          dialogRef1.close('Cancel');
        });
      },
      (err) => {
        console.log(err);
      }
    );

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

  /*openCreateDomainElementModalFromExtend(element: PaletteElementModel) {

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
  }*/

  addSubClassesForLanguage(element: PaletteElementModel) {
    console.log('Selected subclasses : ');
    console.log(element);
    element.uuid = (this.data.paletteElement.label).replace(new RegExp(' ', 'g'), ''); // replace spaces
    element.parentElement = (this.data.paletteElement.label).replace(new RegExp(' ', 'g'), ''); // replace spaces
    this.mService.createLanguageSubclasses(JSON.stringify(element)).subscribe( // synchronous call to webservice
      (response) => {
        this.mService.queryPaletteElements();
        this.dialogRef.close('Cancel');
      }
    );
  }

}
