import { TestBed } from '@angular/core/testing';

import { IdPets } from './id-pets';

describe('IdPets', () => {
  let service: IdPets;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IdPets);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
