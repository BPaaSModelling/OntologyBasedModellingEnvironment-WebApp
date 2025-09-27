import { Component, OnInit, Inject, Output, EventEmitter, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ModellerService } from '../../../core/services/modeller/modeller.service';
import { DomainElementModel } from '../../models/DomainElement.model';
import { UUID } from 'angular2-uuid';
import { PaletteElementModel } from '../../models/PaletteElement.model';
import { ModalEditPaletteElementComponent } from '../modal-edit-palette-element/modal-edit-palette-element.component';
import {PaletteCategoryModel} from '../../models/PaletteCategory.model';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/internal/Observable';
import {DomainInstance} from '../../models/DomainInstanca.model';
import {OntologyRelationInfo} from '../../models/OntologyRelationInfo';
import {InstanceInfo} from '../../models/InstanceInfo';

@Component({
    selector: 'app-modal-create-domain-elements',
    templateUrl: './modal-create-domain-elements.component.html',
    styleUrls: ['./modal-create-domain-elements.component.css']
})
export class ModalCreateDomainElementsComponent implements OnInit {
    creationKind: 'category' | 'defineRelationship' | 'defineAttribute' | 'rule' | 'modelElement' | 'connector' |
      'concept' | 'individual' | 'instanceRelationship' |'attribute' = 'category';

  public readonly OWL_THING = 'http://www.w3.org/2002/07/owl#Thing';
  public RESERVED_PREFIXES = new Set(['owl:', 'rdf:', 'rdfs:', 'xsd:']);

  objectProperties: OntologyRelationInfo[] = [];
  domainInstances: InstanceInfo[] = [];
  rangeInstances: InstanceInfo[] = [];

  public domainElement = new DomainElementModel();
    public relationship = { label: '', domain: '', range: '' };
    public modelElement = {
      label: '',
      associateCategory : '' as string,
      languagePrefix: '',
      comment: '',
      categoryLabel: '',
      thumbnailURL: '',
      imageURL: ''
    };

    public connector = {
      label: '',
      fromArrow: '',
      toArrow: '',
      arrowStroke: '',
      associateCategory : '' as string,
      imageURL: '',
      thumbnailURL: ''
    };

    public concept = {
      label: '',                   // es: 'Human'
      parentLanguageClass: this.OWL_THING, // default
      comment: '',
      equivalentsRaw: ''           // CSV → array al submit
    };

    public individual = {
      classConcept: '',
      label: ''
    };

    public newDataProperty = {
      label: '',
      selectedDomainClass : '',
      selectedInstance : '',
      range : '',
      value : ''
    };

    public currentPaletteElement: PaletteElementModel = new PaletteElementModel();
    arrowHeads: string[] = [];
    arrowStrokes: string[] = [];
    public imageList: string[] = [];
    @Input() isRoot = false;
    private parentElement: null;
    public isPaletteRootElement = false;
    @Output() newDomainElementAdded = new EventEmitter();
    @Output() createConnector = new EventEmitter<string>();
    @Output() createElement = new EventEmitter<void>();


    public imageRoot: string = '/assets/images';
    public arrowBasePath: string = 'Arrows';
    arrowFiles: string[] = [];

    public config: any;
    public config1: any;
    public domainName: string;
    public viewUri: string;
    categoryUri: string;
    parentId: string;
    position: { x: number; y: number };

    categories: PaletteCategoryModel[] = [];

    namespaceMap: Record<string, string> = {};
    private DO = 'http://fhnw.ch/modelingEnvironment/DomainOntology#';
    private DO_ROOT = this.DO + 'DomainOntologyConcept';
    private DO_PREFIX = 'do:';
    instances: { uri: string; label: string; typeUri: string }[] = [];
    selectedProperty: any;
    selectedDomainInstance: any;
    selectedRangeInstance: any;


  constructor(
        public dialogRef: MatDialogRef<ModalCreateDomainElementsComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public mService: ModellerService,
        public dialog: MatDialog,
        private http: HttpClient
    ) {
        this.viewUri = data.currentLanguageView;
        this.categoryUri = data.categoryUri;
        this.parentId = data.parentElementId;
        this.position = data.position;
        this.categories = data.categories;
    }

    async ngOnInit() {
        this.domainName = this.data.paletteElement?.representedLanguageClass || '';
        this.domainElement.modelingView = this.viewUri;
        const pe = this.data?.paletteElement;
        this.mService.queryNamespacePrefixes();
        this.mService.getNamespaceMap().subscribe(list => {
          this.namespaceMap = (list || []).reduce((acc, x) => {
            acc[x.prefix] = x.uri;
            return acc;
          }, {} as Record<string, string>);

        });

        this.loadObjectProperties();

        this.mService.queryDomainClasses();
        this.mService.queryModelingElementClasses();
        this.mService.queryAllProperties(this.domainName);

        if (this.isRoot) {
            this.parentElement = null;
            this.isPaletteRootElement = true;
        }

        this.mService.getArrowStructures().then(value => {
            this.arrowHeads = value.heads;
            this.arrowStrokes = value.strokes;
        });

      if (this.creationKind !== 'attribute' && pe) {
        this.currentPaletteElement.paletteCategory     = pe.paletteCategory;
        this.currentPaletteElement.parentElement       = pe.id;
        this.currentPaletteElement.parentLanguageClass = pe.representedLanguageClass;
      } else {
        // fallback sensati per Attribute
        this.currentPaletteElement.paletteCategory     = this.categoryUri ?? '';
        this.currentPaletteElement.parentElement       = null;
        this.currentPaletteElement.parentLanguageClass = this.OWL_THING;
      }

        this.config = {
            displayKey: 'label',
            search: true,
            height: 'auto',
            placeholder: 'Select Semantic Domain Element',
            limitTo: 5,
            moreText: 'more',
            noResultsFound: 'No results found!',
            searchPlaceholder: 'Search'
        };

        this.config1 = {
            displayKey: 'label',
            search: true,
            height: 'auto',
            placeholder: 'Select Existing Language Element',
            limitTo: 5,
            moreText: 'more',
            noResultsFound: 'No results found!',
            searchPlaceholder: 'Search'
        };



      this.http.get<string[]>(`${this.imageRoot}/${this.arrowBasePath}/images.manifest.json`)
        .subscribe(files => this.arrowFiles = files ?? []);

      // this.existingConcepts = this.mService.queryAllLanguageOntologyConcepts();
       // await this.loadImages();
    }

    save() {
      if (this.creationKind === 'category') {
        if (!this.domainElement.label) {
          alert('Category label is required.');
          return;
        }
        const idSuffix = this.domainElement.label.replace(/\s+/g, '');
        console.log(this.domainElement);
        const payload = {
          id: `http://fhnw.ch/modelingEnvironment/PaletteOntology#${idSuffix}`,
          idSuffix: idSuffix,
          label: this.domainElement.label,
          orderNumber: 1,
          hiddenFromPalette: false,
          modelingView: this.mService.getActualModelingView()
        };
        this.mService.createPaletteCategory(payload).subscribe({
          next: () => this.onSaveSuccess(),
          error: (err) => this.onSaveError(err)

        });
        return;
      }

      if (this.creationKind === 'modelElement') {

        if (!this.modelElement.label || !this.modelElement.languagePrefix) {
          alert('Model element label and prefix are required.');
          return;
        }
        const labelClean = this.modelElement.label.replace(/ /g, '');

        this.currentPaletteElement.label = this.modelElement.label;
        this.currentPaletteElement.representedLanguageClass = `${this.modelElement.languagePrefix}${labelClean}`;
        this.currentPaletteElement.thumbnailURL = this.modelElement.thumbnailURL || 'CustomThumb.svg';
        this.currentPaletteElement.imageURL = this.modelElement.imageURL || 'CustomImage.svg';
        this.currentPaletteElement.width = 150;
        this.currentPaletteElement.height = 80;
        this.currentPaletteElement.x = this.position?.x || 250;
        this.currentPaletteElement.y = this.position?.y || 120;
        this.currentPaletteElement.hiddenFromPalette = false;
        this.currentPaletteElement.modelingView = this.mService.getActualModelingView();
        this.mService.createNewModelingElement(this.currentPaletteElement).subscribe({
          next: () => {
            this.dialog.open(ModalEditPaletteElementComponent, {
              data: {paletteElement: this.currentPaletteElement},
              height: '80%',
              width: '800px',
              disableClose: false
            });
            this.onSaveSuccess();
          },
          error: (err) => this.onSaveError(err)
        });

        return;
      }
      if (this.creationKind === 'concept') {

        const label = (this.concept.label || '').trim();
        if (!label) {
          alert('Class Label is required.');
          return;
        }
        const localName = label.replace(/[^\p{L}\p{N}_-]+/gu, '');

        const iri = this.DO + localName;
        const payload: any = {
          uuid: UUID.UUID(),
          parentLanguageClass: 'do:DomainOntologyConcept',
          label: label,
          representedLanguageClass: iri,
          comment: (this.concept.comment || '').trim() || null
        };

        this.mService.createLanguageSubclasses(payload).subscribe({
          next: () => this.onSaveSuccess(),
          error: (err) => this.onSaveError(err)
        });

        return;
      }
      if (this.creationKind === 'individual') {

        const label = (this.individual.label || '').trim();
        if (!label) {
          alert('Class Label is required.');
          return;
        }
        const localName = label.replace(/[^\p{L}\p{N}_-]+/gu, '');

        const payload: any = {
          classConcept: this.individual.classConcept,
          label: localName
        };

        this.mService.createNewIndividual(payload).subscribe({
          next: () => this.onSaveSuccess(),
          error: (err) => this.onSaveError(err)
        });

        return;
      }

      if (this.creationKind === 'defineRelationship') {
        if (!this.relationship.label || !this.relationship.domain || !this.relationship.range) {
          alert('Relationship label, domain and range are required.');
          return;
        }
        const OntologyRelationshipPayload = {
          label: this.relationship.label,
          domain: this.relationship.domain,
          range: this.relationship.range
        };
        this.mService.createNewRelationship(OntologyRelationshipPayload).subscribe({
          next: () => this.onSaveSuccess(),
          error: (err) => this.onSaveError(err)
        });
      }

      if (this.creationKind === 'attribute') {
        const label = (this.newDataProperty.label || '').trim();
        if (!label) {
          alert('Relationship Label is required.');
          return;
        }

        const localName = label.replace(/[^\p{L}\p{N}_-]+/gu, '');

        const payload: any = {
          label: localName,
          DomainClassURI: this.newDataProperty.selectedDomainClass,
          selectedInstance: this.newDataProperty.selectedInstance,
          range: this.newDataProperty.range,
          value: this.newDataProperty.value
        };

        this.mService.createNewAttribute(payload).subscribe({
          next: () => this.onSaveSuccess(),
          error: (err) => this.onSaveError(err)
        });
        return;
      }

      if (this.creationKind === 'defineAttribute') {
        const label = (this.relationship.label || '').trim();
        const domainClassUri = this.relationship.domain;
        const xsdRange       = this.relationship.range; // può essere "xsd:string", "rdf:HTML", ecc.

        if (!label || !domainClassUri || !xsdRange) {
          alert('Compila label, domain e datatype.');
          return;
        }

        const payload = { label, domainClassUri, xsdRange };

        this.mService.createDatatypeProperty(payload).subscribe({
          next: () => this.onSaveSuccess(),
          error: (err) => this.onSaveError(err)
        });
        return;
      }

      if (this.creationKind === 'instanceRelationship') {
        if (!this.selectedDomainInstance || !this.selectedRangeInstance || !this.selectedProperty){
          alert('Select all the fields.');
          return;
        }

        const payload = {
          propertyLabel : this.selectedProperty.label,
          domainInstance : this.selectedDomainInstance.iri,
          rangeInstance : this.selectedRangeInstance.iri
        };

        this.mService.instanceConceptRelationship(payload).subscribe({
          next: () => this.onSaveSuccess(),
          error: (err) => this.onSaveError(err)
        });
        return;

      }
    }

  private expandFromPrefix(prefix: string): string | null {
    return this.namespaceMap[prefix] || null;
  }

  private onSaveSuccess(): void {
    this.mService.queryPaletteElements().subscribe();
    this.mService.queryDomainClasses();
    this.dialogRef.close('created'); // 👈 segnala al padre che deve ricaricare
  }

  private onSaveError(err: any): void {
    console.error('Errore durante la creazione:', err);
  }

  onCloseCancel(): void {
        this.dialogRef.close('cancel');
    }

    selectionChanged(event: any): void {
        this.domainElement.parentElement = event.value.id;
    }

    private async loadImages() {
        this.mService.getUploadedImages().then(async values => {
            let category = this.data.paletteElement.paletteCategory.split('#')[1];
            this.imageList = values[category];
        });
    }

    processImageUpload(imageInput: any, type: string) {
        const file: File = imageInput.files[0];
        const reader = new FileReader();
        reader.addEventListener('load', async () => {
            const filename = file.name.replace(/[^a-z0-9.]/gi, '_').toLowerCase();
            const category = this.categoryUri.split('#')[1];
            await this.mService.uploadNewImageToBackend(file, filename, category);
            this.imageList.push(filename);
            if (type === 'image') this.currentPaletteElement.imageURL = filename;
            if (type === 'thumbnail') this.currentPaletteElement.thumbnailURL = filename;
        });
        reader.readAsDataURL(file);
    }

  onSelectProperty(prop: OntologyRelationInfo): void {
    if (!prop) return;

    if (prop.domain) {
      this.mService.queryAllInstancesByClass(prop.domain).subscribe((insts: InstanceInfo[]) => {
        this.domainInstances = insts;
      });
    }

    if (prop.range) {
      this.mService.queryAllInstancesByClass(prop.range).subscribe((insts: InstanceInfo[]) => {
        this.rangeInstances = insts;
      });
    }
  }

  private loadObjectProperties(): void {
    console.log('[OBJ-PROPS] calling service…');
    this.mService.queryAllObjectProperty().subscribe({
      next: res => {
        console.log('[OBJ-PROPS] OK len =', res?.length ?? 0);
        this.objectProperties = res ?? [];
      },
      error: err => {
        console.error('[OBJ-PROPS] ERROR', err);
      }
    });
  }
}
