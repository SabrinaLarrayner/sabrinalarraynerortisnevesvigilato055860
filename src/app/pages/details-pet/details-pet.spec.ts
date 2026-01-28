import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsPet } from './details-pet';

describe('DetailsPet', () => {
  let component: DetailsPet;
  let fixture: ComponentFixture<DetailsPet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsPet]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsPet);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
