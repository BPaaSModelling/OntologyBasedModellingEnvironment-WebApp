import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImportExportEnvironmentComponent } from './import-export-environment.component';

describe('ModellingEnvironmentComponent', () => {
  let component: ImportExportEnvironmentComponent;
  let fixture: ComponentFixture<ImportExportEnvironmentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportExportEnvironmentComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportExportEnvironmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
