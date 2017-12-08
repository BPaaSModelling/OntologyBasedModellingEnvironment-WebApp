import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalInsertPropertyComponent } from './modal-insert-property.component';

describe('ModalInsertPropertyComponent', () => {
  let component: ModalInsertPropertyComponent;
  let fixture: ComponentFixture<ModalInsertPropertyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalInsertPropertyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalInsertPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
