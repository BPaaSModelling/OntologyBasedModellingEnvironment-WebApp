import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModellingAreaComponent } from './modelling-area.component';

describe('ModellingAreaComponent', () => {
  let component: ModellingAreaComponent;
  let fixture: ComponentFixture<ModellingAreaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModellingAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModellingAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
