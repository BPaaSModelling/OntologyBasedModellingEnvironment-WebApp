import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorPopupDialogComponent } from './error-popup-dialog.component';

describe('ErrorPopupDialogComponent', () => {
  let component: ErrorPopupDialogComponent;
  let fixture: ComponentFixture<ErrorPopupDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErrorPopupDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErrorPopupDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
