import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModalEditPropertiesComponent } from './modal-edit-datatype-property.component';

describe('ModalEditPropertiesComponent', () => {
  let component: ModalEditPropertiesComponent;
  let fixture: ComponentFixture<ModalEditPropertiesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalEditPropertiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalEditPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
