import { TestBed } from '@angular/core/testing';
import { TutorsListService } from './tutors-list';

describe('TutorsList', () => {
  let service: TutorsListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TutorsListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
