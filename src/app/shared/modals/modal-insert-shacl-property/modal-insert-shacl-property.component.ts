import {Component, OnInit, Output, EventEmitter, Inject} from '@angular/core';
import {ShaclConstraintModel} from '../../models/ShaclConstraint.model';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ModellerService} from '../../../core/services/modeller/modeller.service';
import {PaletteElementModel} from '../../models/PaletteElement.model';
import {ModalCreateDomainElementsComponent} from '../modal-create-domain-elements/modal-create-domain-elements.component';

@Component({
  selector: 'app-modal-insert-shacl-property',
  templateUrl: './modal-insert-shacl-property.component.html',
  styleUrls: ['./modal-insert-shacl-property.component.css']
})

export class ModalInsertShaclPropertyComponent implements OnInit {

  @Output() newConstraintAdded = new EventEmitter();
  public shaclConstraint: ShaclConstraintModel;
  step = 0;
  public config: any;
   constructor(@Inject(MAT_DIALOG_DATA) public data: any,
               public mService: ModellerService,
               public dialogRef: MatDialogRef<ModalInsertShaclPropertyComponent>,
               public dialog: MatDialog) { }

  ngOnInit(): void {
    this.shaclConstraint = new ShaclConstraintModel();

    this.config = {
      displayKey: 'label',
      search: true,
      height: '200px',
      placeholder: 'Select a Path',
      limitTo: 10000,
      moreText: 'more',
      noResultsFound: 'No results found!',
      searchPlaceholder: 'Search'
    };
  }
  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  onCloseCancel() {
    this.dialogRef.close('Cancel');
  }

  selectionChanged(event) {
    console.log(event);
    if(!(event.value === null || event.value === undefined)) {
      this.shaclConstraint.path = event.value.label;
    }
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

  insertNewShaclConstraint() {
    this.shaclConstraint.id = (this.shaclConstraint.name).replace(new RegExp(' ', 'g'), '_');
    this.shaclConstraint.domainName = this.data.paletteElement.representedLanguageClass;
    console.log(this.shaclConstraint.path);
    this.mService.createNewShaclConstraint(JSON.stringify(this.shaclConstraint)).subscribe(
      (response) => {
        console.log(response);
        -this.newConstraintAdded.emit(this.shaclConstraint);
        this.dialogRef.close('Cancel');
      }
    );
  }

}
