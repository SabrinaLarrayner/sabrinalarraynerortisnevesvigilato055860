import { TestBed } from '@angular/core/testing';

import { EditTutor } from './edit-tutor';

describe('EditTutor', () => {
  let service: EditTutor;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditTutor);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
