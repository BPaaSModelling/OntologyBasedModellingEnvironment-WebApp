import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewOntologyComponent } from './create-new-ontology.component';

describe('CreateNewOntologyComponent', () => {
  let component: CreateNewOntologyComponent;
  let fixture: ComponentFixture<CreateNewOntologyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateNewOntologyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewOntologyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
