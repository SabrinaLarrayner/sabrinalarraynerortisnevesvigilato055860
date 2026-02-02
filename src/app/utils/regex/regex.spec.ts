import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Regex } from './regex';

describe('Regex', () => {
  let component: Regex;
  let fixture: ComponentFixture<Regex>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Regex]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Regex);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
