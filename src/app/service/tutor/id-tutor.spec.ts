import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { IdTutor, TutorResponse } from './id-tutor';
import { environment } from '../../../environments/environment';
import { fail } from 'node:assert';

describe('IdTutor', () => {
  let service: IdTutor;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [IdTutor]
    });

    service = TestBed.inject(IdTutor);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verifica se não há requisições abertas/pendentes
    httpMock.verify();
  });

  it('deve ser criado corretamente', () => {
    expect(service).toBeTruthy();
  });

  it('deve buscar os detalhes do tutor e seus pets pelo ID via GET', () => {
    const tutorId = 1;
    const mockResponse: TutorResponse = {
      id: tutorId,
      nome: 'Sabrina Vigilato',
      email: 'sabrina@exemplo.com',
      telefone: '6599999999',
      endereco: 'Várzea Grande, MT',
      cpf: 12345678901,
      foto: {
        id: 10,
        nome: 'avatar.jpg',
        contentType: 'image/jpeg',
        url: 'http://api.com/avatar.jpg'
      },
      pets: [
        {
          id: 50,
          nome: 'Rex',
          raca: 'Labrador',
          idade: 3,
          foto: {
            id: 11,
            nome: 'rex.jpg',
            contentType: 'image/jpeg',
            url: 'http://api.com/rex.jpg'
          }
        }
      ]
    };

    service.execute(tutorId).subscribe((res) => {
      expect(res).toEqual(mockResponse);
      expect(res.pets.length).toBe(1);
      expect(res.pets[0].nome).toBe('Rex');
    });

    // Valida a URL: /tutores/{id}
    const req = httpMock.expectOne(`${environment.api_url}/tutores/${tutorId}`);
    
    expect(req.request.method).toBe('GET');

    // Responde com os dados mockados
    req.flush(mockResponse);
  });

  it('deve lidar com erro 404 quando o tutor não for encontrado', () => {
    const tutorId = 999;

    service.execute(tutorId).subscribe({
      next: () => fail('A requisição deveria ter falhado com 404'),
      error: (error) => {
        expect(error.status).toBe(404);
      }
    });

    const req = httpMock.expectOne(`${environment.api_url}/tutores/${tutorId}`);
    req.flush('Tutor não encontrado', { status: 404, statusText: 'Not Found' });
  });
});