import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPaletteElementPropertiesComponent } from './modal-connector-element-properties.component';

describe('ModalPaletteElementPropertiesComponent', () => {
  let component: ModalPaletteElementPropertiesComponent;
  let fixture: ComponentFixture<ModalPaletteElementPropertiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalPaletteElementPropertiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPaletteElementPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
