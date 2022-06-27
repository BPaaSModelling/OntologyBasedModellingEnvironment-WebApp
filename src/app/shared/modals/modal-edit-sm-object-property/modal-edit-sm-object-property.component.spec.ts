import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModalEditSmObjectPropertyComponent } from './modal-edit-sm-object-property.component';

describe('ModalEditSmObjectPropertyComponent', () => {
  let component: ModalEditSmObjectPropertyComponent;
  let fixture: ComponentFixture<ModalEditSmObjectPropertyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalEditSmObjectPropertyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalEditSmObjectPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
