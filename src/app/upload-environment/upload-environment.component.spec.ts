import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadEnvironmentComponent } from './upload-environment.component';

describe('ModellingEnvironmentComponent', () => {
  let component: UploadEnvironmentComponent;
  let fixture: ComponentFixture<UploadEnvironmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadEnvironmentComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadEnvironmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
