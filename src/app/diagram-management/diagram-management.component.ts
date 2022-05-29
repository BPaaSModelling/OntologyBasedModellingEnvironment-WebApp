import { Component, OnInit } from '@angular/core';
import {ModalModelCreation} from '../modal-model-creation/modal-model-creation.component';
import {Model} from '../_models/Model.model';
import {MatDialog} from '@angular/material/dialog';
import {ModellerService} from '../modeller.service';
import {take} from 'rxjs/operators';
import {NavigationExtras, Router} from '@angular/router';

@Component({
  selector: 'app-diagram-management',
  templateUrl: './diagram-management.component.html',
  styleUrls: ['./diagram-management.component.css']
})
export class DiagramManagementComponent implements OnInit {
  public models: Model[];

  constructor(private matDialog: MatDialog, private modellerService: ModellerService, private router: Router) { }

  ngOnInit(): void {
    this.modellerService.getModels().pipe(take(1)).subscribe(models => {
      this.models = models;
    });
  }

  createNewDiagram() {
    this.matDialog.open(ModalModelCreation, {
      data: new Model()
    });
  }

  editDiagram(model: Model): void {

  }

  deleteDiagram(id: string): void {

  }


  openModel(id: string) {
    const navExtras = {
      queryParams: {
        id
      }
    } as NavigationExtras;
    this.router.navigate(['/modeller'], navExtras);
  }
}
