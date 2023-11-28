import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModalEditPaletteElementComponent } from './modal-edit-palette-element.component';

describe('ModalEditPaletteElementComponent', () => {
  let component: ModalEditPaletteElementComponent;
  let fixture: ComponentFixture<ModalEditPaletteElementComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalEditPaletteElementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalEditPaletteElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
