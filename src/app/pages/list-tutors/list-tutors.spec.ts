import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTutors } from './list-tutors';

describe('ListTutors', () => {
  let component: ListTutors;
  let fixture: ComponentFixture<ListTutors>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListTutors]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListTutors);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
