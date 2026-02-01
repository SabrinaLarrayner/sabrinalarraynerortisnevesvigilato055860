import { TestBed } from '@angular/core/testing';
import { IdPet } from './id-pet';
describe('IdPet', () => {
  let service: IdPet;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IdPet);
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
