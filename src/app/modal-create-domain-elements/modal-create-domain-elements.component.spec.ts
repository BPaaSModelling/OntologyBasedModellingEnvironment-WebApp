import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModalCreateDomainElementsComponent } from './modal-create-domain-elements.component';

describe('ModalCreateDomainElementsComponent', () => {
  let component: ModalCreateDomainElementsComponent;
  let fixture: ComponentFixture<ModalCreateDomainElementsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCreateDomainElementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCreateDomainElementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
