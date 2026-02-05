import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TutorAndPet } from './tutor-and-pet';
import { environment } from '../../../environments/environment';

describe('TutorAndPet', () => {
  let service: TutorAndPet;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TutorAndPet]
    });

    service = TestBed.inject(TutorAndPet);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should link a pet to a tutor via POST', () => {
    const tutorId = 1;
    const petId = 10;

    service.linkPetToTutor(tutorId, petId).subscribe();

    const req = httpMock.expectOne(`${environment.api_url}tutores/${tutorId}/pets/${petId}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});

    req.flush(null);
  });
});
