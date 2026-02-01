import { TestBed } from '@angular/core/testing';

import { DeleteTutorAndPet } from './delete-tutor-and-pet';

describe('DeleteTutorAndPet', () => {
  let service: DeleteTutorAndPet;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeleteTutorAndPet);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
