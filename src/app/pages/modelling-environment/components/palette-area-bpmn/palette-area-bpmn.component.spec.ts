import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaletteAreaBPMNComponent } from './palette-area-bpmn.component';

describe('PaletteAreaBpmnComponent', () => {
  let component: PaletteAreaBPMNComponent;
  let fixture: ComponentFixture<PaletteAreaBPMNComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaletteAreaBPMNComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaletteAreaBPMNComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
