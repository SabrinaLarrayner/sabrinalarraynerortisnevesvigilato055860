import { TestBed } from '@angular/core/testing';

import { IdTutor } from './id-tutor';

describe('IdTutor', () => {
  let service: IdTutor;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IdTutor);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
