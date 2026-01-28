import { TestBed } from '@angular/core/testing';

import { IdPhotoPets } from './id-photo-pets';

describe('IdPhotoPets', () => {
  let service: IdPhotoPets;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IdPhotoPets);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
