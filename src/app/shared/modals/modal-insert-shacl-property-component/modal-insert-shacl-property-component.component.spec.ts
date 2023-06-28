import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalInsertShaclPropertyComponentComponent } from './modal-insert-shacl-property-component.component';

describe('ModalInsertShaclPropertyComponentComponent', () => {
  let component: ModalInsertShaclPropertyComponentComponent;
  let fixture: ComponentFixture<ModalInsertShaclPropertyComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalInsertShaclPropertyComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalInsertShaclPropertyComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
