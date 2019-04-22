import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OmvStepComponent } from './omv-step.component';

describe('OmvStepComponent', () => {
  let component: OmvStepComponent;
  let fixture: ComponentFixture<OmvStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OmvStepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OmvStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
