import { TestBed } from '@angular/core/testing';

import { IdPetDelete } from './id-pet-delete';

describe('IdPetDelete', () => {
  let service: IdPetDelete;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IdPetDelete);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
