import {Component, OnInit} from '@angular/core';
import {ModellerService} from '../modeller.service';

@Component({
  selector: 'app-modal-edit-palette-element',
  templateUrl: './mobile-upload.component.html',
  styleUrls: ['./mobile-upload.component.css']
})
export class MobileUploadComponent implements OnInit {

  selectedFile: File;

  constructor(public mService: ModellerService) {
  }

  ngOnInit() {

  }

  onCloseCancel() {
  }

  selectionChanged($event: any) {
    console.log('Selection changed');
  }

  processImageUpload(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', async (event: any) => {
      this.selectedFile = file;
      const currentPalletteCategory = "SAPScenesElements";
      //this.data.paletteElement.paletteCategory.split('#')[1];
      await this.mService.uploadNewImageToBackend(file, file.name, currentPalletteCategory);
    });

    reader.readAsDataURL(file);
  }
}
