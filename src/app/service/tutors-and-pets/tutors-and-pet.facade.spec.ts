import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { tutorAndPet } from './tutors-and-pet.facade';
import { TutorAndPet } from './delete-tutor-and-pet';

describe('TutorsAndPetFacade', () => {
  let facade: tutorAndPet;
  let tutorAndPetMock: Partial<TutorAndPet>;

  beforeEach(() => {
    tutorAndPetMock = {
      linkPetToTutor: vi.fn().mockReturnValue(of(void 0)),
      unlinkPetFromTutor: vi.fn().mockReturnValue(of(void 0)),
    };

    TestBed.configureTestingModule({
      providers: [
        tutorAndPet,
        { provide: TutorAndPet, useValue: tutorAndPetMock },
      ],
    });

    facade = TestBed.inject(tutorAndPet);
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });

  it('should call linkPetToTutor', () => {
    facade.linkPet(1, 10).subscribe();
    expect(tutorAndPetMock.linkPetToTutor).toHaveBeenCalledWith(1, 10);
  });

  it('should call unlinkPetFromTutor', () => {
    facade.unlinkPet(1, 10).subscribe();
    expect(tutorAndPetMock.unlinkPetFromTutor).toHaveBeenCalledWith(1, 10);
  });
});
