
import {Component, Input, OnInit, SimpleChanges} from '@angular/core';
import {ModellerService} from '../modeller.service';
import {PaletteElementModel} from '../_models/PaletteElement.model';
import {MatDialog} from '@angular/material';
import {Model} from '../_models/Model.model';
import * as go from 'gojs';
import {FileUploadService} from '../file-upload/file-upload.service';


@Component({
  selector: 'app-modelling-environment',
  templateUrl: './EAP-Validator-environment.component.html',
  styleUrls: ['./EAP-Validator-environment.component.css']
})
export class EAPValidatorEnvironmentComponent implements OnInit {
  propElement: Object;
  new_element: PaletteElementModel;
  showProp: boolean;

  constructor(public mService: ModellerService, public dialog: MatDialog, private fileUploadService: FileUploadService, private uploadService: ModellerService) {
    this.showProp = false;
  }
  public selectedModel: Model;
  public models: Model[] = [];
  public eap: string;
  public eap2: string;
  public eap3: string;
  shortLink: string = "";
  loading: boolean = false; // Flag variable
  file: File = null; // Variable to store file



  ngOnInit() {
    this.prepareModels();
  }


  postEAPForValidationFromDesktop(): void {

    if (this.shortLink != "") {
      var eapModel: string[] = [];
      eapModel[0] = this.selectedModel.id;
      eapModel[1] = this.shortLink;
      this.mService.queryEAPValidation(eapModel);
      const greenTickConst = document.getElementById('greenTick0');
      const redXConst = document.getElementById('redTick0');

      greenTickConst.style.display = 'none';
      redXConst.style.display = 'none';

      if (this.mService.eapResult.toString() == "true") {
        greenTickConst.style.display = 'block';
      } else if (this.mService.eapResult.toString() == "false") {
        redXConst.style.display = 'block';
      }
    }
  }



  postEAPForValidationSpoc(): void {

  this.eap="spoc";
  var eapModel: string[] = [];
  eapModel[0]=this.selectedModel.id;
  eapModel[1]=this.eap;
  this.mService.queryEAPValidationSPOC(eapModel);
  const  greenTickConst = document.getElementById('greenTick1');
  const  redXConst = document.getElementById('redTick1');


    if (this.mService.eapResult.toString()=="true"){
      greenTickConst.style.display ='block';
     }
    else
      if(this.mService.eapResult.toString()=="false") {
        redXConst.style.display = 'block';
       }
  }

  postEAPForValidationMDM(): void {
    this.eap2="ssot";
    var eapModel2: string[] = [];
    eapModel2[0]=this.selectedModel.id;
    eapModel2[1]=this.eap2;
    this.mService.queryEAPValidation2(eapModel2);
    const  greenTickConst = document.getElementById('greenTick2');
    const  redXConst = document.getElementById('redTick2');


    if (this.mService.eapResult2.toString()=="true"){
      greenTickConst.style.display ='block';
    }
    else
    if(this.mService.eapResult2.toString()=="false") {
      redXConst.style.display = 'block';
    }
  }


  postEAPForValidationMsTeams(): void {
    this.eap3="msteams";
    var eapModel3: string[] = [];
    eapModel3[0]=this.selectedModel.id;
    eapModel3[1]=this.eap3;
    this.mService.queryEAPValidation3(eapModel3);
    const  greenTickConst = document.getElementById('greenTick3');
    const  redXConst = document.getElementById('redTick3');


    if (this.mService.eapResult3.toString()=="true"){
      greenTickConst.style.display ='block';
    }
    else
    if(this.mService.eapResult3.toString()=="false") {
      redXConst.style.display = 'block';
    }
  }

  private prepareModels() {
    this.mService.getModels().then(models => {
      this.models = models;

      this.models.forEach(model => {
        model.goJsModel = new go.GraphLinksModel();

        this.mService.getElements(model.id).then(value => {

        });
      });

    });
  }


  onChange(event) {
    this.file = event.target.files[0];
  }

  // OnClick of button Upload
  onUpload() {
    this.loading = !this.loading;
    console.log(this.file);
    this.fileUploadService.upload(this.file).subscribe(
      (event: any) => {
        if (typeof (event) === 'object') {

          // Short link via api response
          this.shortLink = event.link;

          this.loading = false; // Flag variable

          console.log("Fine upload!")
          const x = document.getElementById('myDIV');
          x.style.display = 'block';
          this.postEAPForValidationFromDesktop();


        }
      }
    );
  }


}
