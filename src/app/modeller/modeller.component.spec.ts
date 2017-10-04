import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModellerComponent } from './modeller.component';

describe('ModellerComponent', () => {
  let component: ModellerComponent;
  let fixture: ComponentFixture<ModellerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModellerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
