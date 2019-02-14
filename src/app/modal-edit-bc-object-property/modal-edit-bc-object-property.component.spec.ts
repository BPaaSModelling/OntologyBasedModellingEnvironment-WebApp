import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditObjectPropertyComponent } from './modal-edit-bc-object-property.component';

describe('ModalEditObjectPropertyComponent', () => {
  let component: ModalEditObjectPropertyComponent;
  let fixture: ComponentFixture<ModalEditObjectPropertyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalEditObjectPropertyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalEditObjectPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
