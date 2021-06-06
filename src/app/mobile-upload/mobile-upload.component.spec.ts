import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileUploadComponent } from './mobile-upload.component';

describe('ModalEditPaletteElementComponent', () => {
  let component: MobileUploadComponent;
  let fixture: ComponentFixture<MobileUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobileUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
