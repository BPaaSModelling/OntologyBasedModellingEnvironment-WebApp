import {Component, Inject, OnInit, Output, EventEmitter, ChangeDetectorRef} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog} from '@angular/material/dialog';
import {DomainElementModel} from 'src/app/shared/models/DomainElement.model';
import {ModellerService} from 'src/app/core/services/modeller/modeller.service';
import {PaletteElementModel} from 'src/app/shared/models/PaletteElement.model';
import {ModalCreateDomainElementsComponent
} from 'src/app/shared/modals/modal-create-domain-elements/modal-create-domain-elements.component';
import {ModalAddPropertiesComponent} from 'src/app/shared/modals/modal-add-properties/modal-add-properties.component';
import {VariablesSettings} from 'src/app/_settings/variables.settings';
import * as go from 'gojs';
import {take} from 'rxjs/operators';
import {UUID} from 'angular2-uuid';

// import {ModalEditPaletteElementComponent} from '../modal-edit-palette-element/modal-edit-palette-element.component';

@Component({
  selector: 'app-create-new-ontology',
  templateUrl: './create-new-ontology.component.html',
  styleUrls: ['./create-new-ontology.component.css']
})
export class CreateNewOntologyComponent implements OnInit {

  private ontologyClasses: DomainElementModel[] = [];
  public currentPaletteElement: PaletteElementModel;
  public activityImageList: any;
  public eventImageList: any;
  public gatewayImageList: any;
  public dataObjectImageList: any;
  public groupImageList: any;

  public documents4DSML4PTMImageList: any;
  public data4DSML4PTMImageList: any;
  public activities4DSML4PTMImageList: any;
  public connectors4DSML4PTMDocumentViewImageList: any;

  public group4BPaaSImageList: any;

  public organizationalUnitImageList: any;
  public performerImageList: any;
  public roleImageList: any;

  public sapscenesImageList: any;
  public sapscenesRelationsList: any;

  public archiMateApplicationLayerList: any;
  public archiMateBusinessLayerList: any;
  public archiMateTechnologyLayerList: any;

  public floWare_SystemLayerList: any;
  public domainName: string;


  public config: any;
  public config1: any;
  public VariablesSettings: any;

  public arrowHeads: string[] = [];
  public arrowStrokes: string[] = [];

  public uploadedList: any;
  public imageList: string[] = [];

  public imageRoot: string = VariablesSettings.IMG_ROOT;

  // @Output() showCreateDomainElementModalFromExtend = new EventEmitter();
  // @Output() newElementCreated = new EventEmitter();
  constructor(
    public dialogRef: MatDialogRef<CreateNewOntologyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public mService: ModellerService, public dialog: MatDialog, private changeDetection: ChangeDetectorRef) {
    this.ontologyClasses = data.ontologyClasses;
    this.VariablesSettings = VariablesSettings;
  }

  ngOnInit(): void {
    console.log('Domain name is ' + this.domainName);

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
  }

  onCloseCancel() {

  }

  createElementInOntology() {

  }

  processImageUpload(imageInput1: HTMLInputElement, canvas: string) {

  }

  addSubClassesForLanguage(paletteElement: any) {

  }

  selectionChangedForIntegrate($event: any) {

  }
}
