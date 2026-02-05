import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IdPetDelete } from './id-pet-delete';

describe('IdPetDelete', () => {
  let service: IdPetDelete;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    service = TestBed.inject(IdPetDelete);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
