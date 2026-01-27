import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutToggleView } from './layout-toggle-view';

describe('LayoutToggleView', () => {
  let component: LayoutToggleView;
  let fixture: ComponentFixture<LayoutToggleView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutToggleView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutToggleView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
