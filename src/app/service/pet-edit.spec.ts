import { TestBed } from '@angular/core/testing';

import { PetEdit } from './pet-edit';

describe('PetEdit', () => {
  let service: PetEdit;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PetEdit);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
