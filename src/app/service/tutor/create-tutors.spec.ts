import { TestBed } from '@angular/core/testing';

import { CreateTutorService } from './create-tutors';

describe('CreateTutorService', () => {
  let service: CreateTutorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateTutorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
