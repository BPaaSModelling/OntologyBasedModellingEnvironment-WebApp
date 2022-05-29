import { Component, OnInit } from '@angular/core';
import {ModalModelCreation} from '../modal-model-creation/modal-model-creation.component';
import {Model} from '../_models/Model.model';
import {MatDialog} from '@angular/material/dialog';
import {ModellerService} from '../modeller.service';

@Component({
  selector: 'app-diagram-management',
  templateUrl: './diagram-management.component.html',
  styleUrls: ['./diagram-management.component.css']
})
export class DiagramManagementComponent implements OnInit {
  constructor(private matDialog: MatDialog) { }

  ngOnInit(): void {
  }

  createNewDiagram() {
    this.matDialog.open(ModalModelCreation, {
      data: new Model()
    });
  }
}
