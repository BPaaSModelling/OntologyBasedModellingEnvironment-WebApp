import {Component, OnInit} from '@angular/core';
import {ModellerService} from '../modeller.service';
import {ModelingViewModel} from '../_models/ModelingView.model';
import {PaletteCategoryModel} from '../_models/PaletteCategory.model';

@Component({
  selector: 'app-modal-edit-palette-element',
  templateUrl: './mobile-upload.component.html',
  styleUrls: ['./mobile-upload.component.css']
})
export class MobileUploadComponent implements OnInit {

  selectedFile: File;
  public canvasTextBoxText: string;
  public imageName: string;
  public modelingViews: ModelingViewModel[] = [];
  public paletteCategories: PaletteCategoryModel[] = [];

  constructor(public mService: ModellerService) {
    this.mService.queryModelingLanguages()
  }

  ngOnInit() {

  }

  onCloseCancel() {
  }

  selectionChanged($event: any) {
    console.log('Selection changed');
  }

  processImageUpload(imageInput: any, type: string) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', async (event: any) => {

      this.selectedFile = file;
      let filename = this.imageName + "." + file.type.substring(6);
      if (type === 'thumbnail') {
        filename = 'Thumbnail_' + filename;
      }
      const currentPalletteCategory = this.mService.selectedModelingLanguage.substring(3);
      await this.mService.uploadNewImageToBackend(file, filename, currentPalletteCategory);
      this.canvasTextBoxText = 'Uploaded ' + type + ' image ' + filename + ' to ' + currentPalletteCategory;
    });
    reader.readAsDataURL(file);
  }

  selectLang($event: any) {
    console.log('Modeling language selected');
    console.log($event.value);
    this.modelingViews = [];
    this.paletteCategories = [];
    this.mService.queryModelingViews($event.value).subscribe(
      (response) => {
        console.log(response);
        this.modelingViews = response;
      }
    );
  }

  selectView($event: any) {
    console.log('Modeling View selected');
    console.log($event.value);
    this.paletteCategories = [];
    this.mService.queryPaletteCategories($event.value).subscribe(
      (response) => {
        console.log(response);
        this.paletteCategories = response;
        this.mService.queryPaletteElements();
        console.log('Palette elements:');
        console.log(this.mService.paletteElements);
      }
    );
    console.log('Palette categories');
    console.log(this.paletteCategories);
  }
}
