import { TestBed } from '@angular/core/testing';

import { DeleteTutor } from './delete-tutor';

describe('DeleteTutor', () => {
  let service: DeleteTutor;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeleteTutor);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
