import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTutor } from './create-tutor';

describe('CreateTutor', () => {
  let component: CreateTutor;
  let fixture: ComponentFixture<CreateTutor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateTutor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateTutor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
