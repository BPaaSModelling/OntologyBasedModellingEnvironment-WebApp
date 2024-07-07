import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModellingAreaBPMNComponent  } from './modelling-area-bpmn.component';

describe('ModellingAreaBpmnComponent', () => {
  let component: ModellingAreaBPMNComponent ;
  let fixture: ComponentFixture<ModellingAreaBPMNComponent >;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModellingAreaBPMNComponent  ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModellingAreaBPMNComponent );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
