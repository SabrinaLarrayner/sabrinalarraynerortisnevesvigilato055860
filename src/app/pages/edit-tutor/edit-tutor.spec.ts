import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTutor } from './edit-tutor';

describe('EditTutor', () => {
  let component: EditTutor;
  let fixture: ComponentFixture<EditTutor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditTutor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditTutor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
