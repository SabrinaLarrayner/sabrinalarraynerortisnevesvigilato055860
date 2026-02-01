import { TestBed } from '@angular/core/testing';

import { PetFacade } from './pet.facade';

describe('PetFacade', () => {
  let service: PetFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PetFacade);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
