import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Step4FamilyComponent } from './step4-family.component';

describe('Step4FamilyComponent', () => {
  let component: Step4FamilyComponent;
  let fixture: ComponentFixture<Step4FamilyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Step4FamilyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Step4FamilyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
