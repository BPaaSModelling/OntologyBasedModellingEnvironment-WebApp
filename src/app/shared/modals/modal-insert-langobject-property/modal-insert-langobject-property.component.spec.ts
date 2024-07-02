import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModalInsertLangobjectPropertyComponent } from './modal-insert-langobject-property.component';

describe('ModalInsertLangobjectPropertyComponent', () => {
  let component: ModalInsertLangobjectPropertyComponent;
  let fixture: ComponentFixture<ModalInsertLangobjectPropertyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalInsertLangobjectPropertyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalInsertLangobjectPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
