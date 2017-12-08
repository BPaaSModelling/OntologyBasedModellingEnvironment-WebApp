import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material";

@Component({
  selector: 'app-modal-insert-property',
  templateUrl: './modal-insert-property.component.html',
  styleUrls: ['./modal-insert-property.component.css']
})
export class ModalInsertPropertyComponent implements OnInit {
step = 0;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
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

}
