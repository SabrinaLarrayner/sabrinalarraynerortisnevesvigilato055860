import { TestBed } from '@angular/core/testing';

import { IdPhotoTutorsService } from './id-photo-tutors';

describe('IdPhotoTutorsService', () => {
  let service: IdPhotoTutorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IdPhotoTutorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
