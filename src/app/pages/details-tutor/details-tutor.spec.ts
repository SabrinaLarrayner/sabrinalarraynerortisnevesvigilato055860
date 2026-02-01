import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsTutor } from './details-tutor';

describe('DetailsTutor', () => {
  let component: DetailsTutor;
  let fixture: ComponentFixture<DetailsTutor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsTutor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsTutor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
