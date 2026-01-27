import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutDefaut } from './layout-defaut';

describe('LayoutDefaut', () => {
  let component: LayoutDefaut;
  let fixture: ComponentFixture<LayoutDefaut>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutDefaut]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutDefaut);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
