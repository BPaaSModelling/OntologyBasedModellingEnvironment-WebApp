import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PropertyWindowComponent } from './modal-instance-properties.component';

describe('PropertyWindowComponent', () => {
  let component: PropertyWindowComponent;
  let fixture: ComponentFixture<PropertyWindowComponent>;

  beforeEach(waitForAsync(() => {
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
