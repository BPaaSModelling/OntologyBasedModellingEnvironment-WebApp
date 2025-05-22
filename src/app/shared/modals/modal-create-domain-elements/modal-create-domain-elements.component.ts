import { Component, OnInit, Inject, Output, EventEmitter, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ModellerService } from '../../../core/services/modeller/modeller.service';
import { DomainElementModel } from '../../models/DomainElement.model';
import { UUID } from 'angular2-uuid';
import { PaletteElementModel } from '../../models/PaletteElement.model';
import { ModalEditPaletteElementComponent } from '../modal-edit-palette-element/modal-edit-palette-element.component';

@Component({
    selector: 'app-modal-create-domain-elements',
    templateUrl: './modal-create-domain-elements.component.html',
    styleUrls: ['./modal-create-domain-elements.component.css']
})
export class ModalCreateDomainElementsComponent implements OnInit {
    creationKind: 'category' | 'relationship' | 'rule' | 'modelElement' | 'connector' = 'category';

    public domainElement = new DomainElementModel();
    public relationship = { label: '', domain: '', range: '' };
    modelElement = {
        label: '',
        classUri: '',
        languagePrefix: '',
        comment: '',
        categoryLabel: '',
        thumbnailURL: '',
        imageURL: ''
    };

    connector = {
        label: '',
        fromArrow: '',
        toArrow: '',
        arrowStroke: ''
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


    public imageRoot: string = '/assets/images/';
    public config: any;
    public config1: any;
    public domainName: string;
    viewUri: string;
    categoryUri: string;
    parentId: string;
    position: { x: number; y: number };

    constructor(
        public dialogRef: MatDialogRef<ModalCreateDomainElementsComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public mService: ModellerService,
        public dialog: MatDialog
    ) {
        this.viewUri = data.viewUri;
        this.categoryUri = data.categoryUri;
        this.parentId = data.parentElementId;
        this.position = data.position;
    }

    async ngOnInit() {
        this.domainName = this.data.paletteElement?.representedLanguageClass || '';

        this.mService.queryNamespacePrefixes();
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

        this.currentPaletteElement.paletteCategory = this.data.paletteElement.paletteCategory;
        this.currentPaletteElement.parentElement = this.data.paletteElement.id;
        this.currentPaletteElement.parentLanguageClass = this.data.paletteElement.representedLanguageClass;

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

        await this.loadImages();
    }

    save() {
        if (this.creationKind === 'category') {
            if (!this.domainElement.label) {
                alert('Category label is required.');
                return;
            }
            const payload = { type: 'Category', label: this.domainElement.label };
            this.mService.createElementInOntology(payload).subscribe(() => {
                this.mService.queryPaletteElements().subscribe();
                this.onCloseCancel();
            });
            return;
        }

        if (this.creationKind === 'relationship') {
            if (!this.relationship.label || !this.relationship.domain || !this.relationship.range) {
                alert('Relationship label, domain and range are required.');
                return;
            }
            const payload = { type: 'Relationship', ...this.relationship };
            this.mService.createElementInOntology(payload).subscribe(() => {
                this.mService.queryPaletteElements().subscribe();
                this.onCloseCancel();
            });
            return;
        }

        if (this.creationKind === 'modelElement') {
            if (!this.modelElement.label || !this.modelElement.classUri || !this.modelElement.languagePrefix) {
                alert('Model element label, URI and prefix are required.');
                return;
            }

            const uuid = UUID.UUID();
            const labelClean = this.modelElement.label.replace(/ /g, '');
            this.currentPaletteElement.uuid = uuid;
            this.currentPaletteElement.label = this.modelElement.label;
            this.currentPaletteElement.representedLanguageClass = `${this.modelElement.languagePrefix}${labelClean}`;
            this.currentPaletteElement.thumbnailURL = this.modelElement.thumbnailURL || 'CustomThumb.png';
            this.currentPaletteElement.imageURL = this.modelElement.imageURL || 'CustomImage.png';
            this.currentPaletteElement.width = 120;
            this.currentPaletteElement.height = 70;
            this.currentPaletteElement.x = this.position?.x || 200;
            this.currentPaletteElement.y = this.position?.y || 150;
            this.currentPaletteElement.hiddenFromPalette = false;
            this.currentPaletteElement.modelingView = this.viewUri;

            this.mService.createElementInOntology(this.currentPaletteElement).subscribe(() => {
                this.dialog.open(ModalEditPaletteElementComponent, {
                    data: { paletteElement: this.currentPaletteElement },
                    height: '80%',
                    width: '800px',
                    disableClose: false
                });
                this.mService.queryPaletteElements().subscribe();
                this.onCloseCancel();
            });
            return;
        }

        if (this.creationKind === 'connector') {
            if (!this.connector.label || !this.connector.fromArrow || !this.connector.toArrow || !this.connector.arrowStroke) {
                alert('All connector fields are required.');
                return;
            }

            const uuid = UUID.UUID();
            const labelClean = this.connector.label.replace(/ /g, '');

            const connectorPayload = {
                uuid: uuid,
                id: '',
                label: this.connector.label,
                type: 'PaletteConnector',
                hiddenFromPalette: false,
                usesImages: false,
                elementUsesImage: true,
                arrowBaseUsesImage: true,
                fromArrow: this.connector.fromArrow,
                toArrow: this.connector.toArrow,
                arrowStroke: this.connector.arrowStroke,
                width: 100,
                height: 70,
                x: this.position?.x || 200,
                y: this.position?.y || 150,
                modelingView: this.viewUri,
                paletteCategory: this.categoryUri,
                parentElement: this.parentId,
                representedLanguageClass: labelClean,
                imageURL: 'MyCustomConnector.png',
                thumbnailURL: 'Thumbnail_MyCustomConnector.png'
            };

            this.mService.createElementInOntology(connectorPayload).subscribe(() => {
                this.mService.queryPaletteElements().subscribe();
                this.onCloseCancel();
            });
            return;
        }
    }

    onCloseCancel(): void {
        this.dialogRef.close('Cancel');
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
}
