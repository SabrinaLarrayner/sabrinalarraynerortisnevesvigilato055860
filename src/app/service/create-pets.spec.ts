import { TestBed } from '@angular/core/testing';

import { CreatePets } from './create-pets';

describe('CreatePets', () => {
  let service: CreatePets;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreatePets);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
