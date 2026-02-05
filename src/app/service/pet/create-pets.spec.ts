import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CreatePets, PetRequest, PetResponse } from './create-pets';
import { environment } from '../../../environments/environment';
import { fail } from 'node:assert';

describe('CreatePets', () => {
  let service: CreatePets;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CreatePets]
    });

    service = TestBed.inject(CreatePets);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('deve enviar um POST para criar um novo pet', () => {
    const mockRequest: PetRequest = {
      nome: 'Bidu',
      raca: 'Schnauzer',
      idade: 2
    };

    const mockResponse: PetResponse = {
      id: 50,
      ...mockRequest,
      foto: null
    };

    service.execute(mockRequest).subscribe((res) => {
      expect(res).toEqual(mockResponse);
      expect(res.id).toBe(50);
    });
    const req = httpMock.expectOne(`${environment.api_url}/pets`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockRequest);
    req.flush(mockResponse);
  });

  it('deve lidar com erro ao tentar criar um pet com dados inválidos', () => {
    const incompleteRequest: any = { nome: '' };

    service.execute(incompleteRequest).subscribe({
      next: () => fail('Deveria ter falhado com erro 400'),
      error: (error) => {
        expect(error.status).toBe(400);
      }
    });

    const req = httpMock.expectOne(`${environment.api_url}/pets`);
    req.flush('Bad Request', { status: 400, statusText: 'Bad Request' });
  });
});
