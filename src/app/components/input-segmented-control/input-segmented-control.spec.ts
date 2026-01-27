import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputSegmentedControl } from './input-segmented-control';

describe('InputSegmentedControl', () => {
  let component: InputSegmentedControl;
  let fixture: ComponentFixture<InputSegmentedControl>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputSegmentedControl]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputSegmentedControl);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
