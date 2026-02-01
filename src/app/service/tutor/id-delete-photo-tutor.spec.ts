import { TestBed } from '@angular/core/testing';

import { IdDeletPhoto } from './id-delete-photo-tutor';

describe('IdDeletPhoto', () => {
  let service: IdDeletPhoto;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IdDeletPhoto);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
