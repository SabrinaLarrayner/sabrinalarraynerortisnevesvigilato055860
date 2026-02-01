import { TestBed } from '@angular/core/testing';

import { IdPhotoTutor } from './id-photo-tutor';

describe('IdPhotoTutor', () => {
  let service: IdPhotoTutor;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IdPhotoTutor);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
