import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { IdPet, PetDetailResponse } from './id-pet';
import { environment } from '../../../environments/environment';
import { fail } from 'node:assert';

describe('IdPet', () => {
  let service: IdPet;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [IdPet]
    });

    service = TestBed.inject(IdPet);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('deve buscar os detalhes de um pet pelo ID', () => {
    const petId = 1;
    const mockResponse: PetDetailResponse = {
      id: petId,
      nome: 'Bento',
      raca: 'Golden Retriever',
      idade: 3,
      foto: {
        id: 10,
        nome: 'foto_bento.jpg',
        contentType: 'image/jpeg',
        url: 'http://api.com/foto_bento.jpg'
      },
      tutores: [
        {
          id: 100,
          nome: 'Joana',
          email: 'Joana@email.com',
          telefone: '6599999999',
          endereco: 'Várzea Grande, MT',
          cpf: 12345678901
        }
      ]
    };

    service.execute(petId).subscribe((res) => {
      expect(res).toEqual(mockResponse);
      expect(res.tutores.length).toBe(1);
      expect(res.nome).toBe('Bento');
    });

    const req = httpMock.expectOne(`${environment.api_url}/pets/${petId}`);
    
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('deve lidar com erro 404 quando o pet não for encontrado', () => {
    const petId = 999;

    service.execute(petId).subscribe({
      next: () => fail('Deveria ter falhado com erro 404'),
      error: (error) => {
        expect(error.status).toBe(404);
      }
    });

    const req = httpMock.expectOne(`${environment.api_url}/pets/${petId}`);
    req.flush('Pet não encontrado', { status: 404, statusText: 'Not Found' });
  });
});