import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CreateTutorService, TutorRequest, TutorResponse } from './create-tutors';
import { environment } from '../../../environments/environment';
import { fail } from 'node:assert';

describe('CreateTutorService', () => {
  let service: CreateTutorService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CreateTutorService]
    });

    service = TestBed.inject(CreateTutorService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve ser criado corretamente', () => {
    expect(service).toBeTruthy();
  });

  it('deve enviar um POST para cadastrar um novo tutor', () => {
    const mockRequest: TutorRequest = {
      nome: 'Joana Fernandes',
      email: 'Joana@exemplo.com',
      telefone: '6599999999',
      endereco: 'Várzea Grande, MT',
      cpf: 12345678901
    };

    const mockResponse: TutorResponse = {
      id: 1,
      ...mockRequest,
      foto: {
        id: 10,
        nome: 'avatar.jpg',
        contentType: 'image/jpeg',
        url: 'http://api.com/fotos/avatar.jpg'
      }
    };

    service.execute(mockRequest).subscribe((res) => {
      expect(res).toEqual(mockResponse);
      expect(res.cpf).toBe(12345678901);
    });
    const req = httpMock.expectOne(`${environment.api_url}/tutores`);
    
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockRequest);
    req.flush(mockResponse);
  });
  it('deve lidar com erro ao tentar cadastrar tutor com CPF duplicado ou inválido', () => {
    const invalidTutor: any = { nome: 'Incompleto' };

    service.execute(invalidTutor).subscribe({
      next: () => fail('Deveria ter falhado com erro 400'),
      error: (error) => {
        expect(error.status).toBe(400);
      }
    });
    const req = httpMock.expectOne(`${environment.api_url}/tutores`);
    req.flush('Dados inválidos', { status: 400, statusText: 'Bad Request' });
  });
});