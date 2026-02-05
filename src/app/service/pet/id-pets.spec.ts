import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { IdPets, PetDetailResponse } from './id-pets';
import { environment } from '../../../environments/environment';
import { fail } from 'node:assert';

describe('IdPets', () => {
  let service: IdPets;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [IdPets]
    });

    service = TestBed.inject(IdPets);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve ser criado corretamente', () => {
    expect(service).toBeTruthy();
  });
  it('deve buscar os detalhes do pet pelo ID via GET', () => {
    const petId = 42;
    const mockResponse: PetDetailResponse = {
      id: petId,
      nome: 'Luna',
      raca: 'Siamês',
      idade: 2,
      foto: {
        id: 1,
        nome: 'luna.jpg',
        contentType: 'image/jpeg',
        url: 'http://cdn.com/luna.jpg'
      },
      tutores: [
        {
          id: 7,
          nome: 'Joana Fernandes',
          email: 'Joana@exemplo.com',
          telefone: '6599999999',
          endereco: 'Várzea Grande, MT',
          cpf: 12345678901
        }
      ]
    };

    service.execute(petId).subscribe((res) => {
      expect(res).toEqual(mockResponse);
      expect(res.id).toBe(petId);
      expect(res.tutores[0].nome).toBe('Joana Fernandes');
    });

    const req = httpMock.expectOne(`${environment.api_url}/pets/${petId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('deve retornar erro quando o ID do pet não existir (404)', () => {
    const petId = 999;

    service.execute(petId).subscribe({
      next: () => fail('A requisição deveria ter falhado com 404'),
      error: (error) => {
        expect(error.status).toBe(404);
      }
    });

    const req = httpMock.expectOne(`${environment.api_url}/pets/${petId}`);
    req.flush('Not Found', { status: 404, statusText: 'Not Found' });
  });
});