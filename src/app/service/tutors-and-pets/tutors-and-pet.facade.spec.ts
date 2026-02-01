import { TestBed } from '@angular/core/testing';

import { TutorsAndPetFacade } from './tutors-and-pet.facade';

describe('TutorsAndPetFacade', () => {
  let service: TutorsAndPetFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TutorsAndPetFacade);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
