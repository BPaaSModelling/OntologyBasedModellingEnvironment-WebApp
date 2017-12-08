import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyWindowComponent } from './modal-instance-properties.component';

describe('PropertyWindowComponent', () => {
  let component: PropertyWindowComponent;
  let fixture: ComponentFixture<PropertyWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyWindowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
