import { TestBed } from '@angular/core/testing';

import { TutorAndPet } from './tutor-and-pet';

describe('TutorAndPet', () => {
  let service: TutorAndPet;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TutorAndPet);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
