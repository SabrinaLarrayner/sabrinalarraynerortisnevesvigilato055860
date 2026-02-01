import { TestBed } from '@angular/core/testing';
import { TutorFacade } from './tutor.facade';

describe('TutorFacade', () => {
  let facade: TutorFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    facade = TestBed.inject(TutorFacade);
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });
});
