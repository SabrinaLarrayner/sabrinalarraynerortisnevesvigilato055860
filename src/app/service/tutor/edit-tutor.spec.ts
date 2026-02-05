import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EditTutorService, TutorUpdatePayload } from './edit-tutor';
import { environment } from '../../../environments/environment';
import { fail } from 'node:assert';

describe('EditTutorService', () => {
  let service: EditTutorService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EditTutorService]
    });

    service = TestBed.inject(EditTutorService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Garante que não existam requisições pendentes
    httpMock.verify();
  });

  it('deve ser criado corretamente', () => {
    expect(service).toBeTruthy();
  });

  it('deve atualizar os dados do tutor via PUT', () => {
    const tutorId = 10;
    const mockPayload: TutorUpdatePayload = {
      nome: 'Joana Fernandes Atualizada',
      email: 'Joana.new@email.com',
      telefone: '6599999999',
      endereco: 'Cuiabá, MT',
      cpf: 12345678901
    };

    const mockResponse = { id: tutorId, ...mockPayload };

    service.update(tutorId, mockPayload).subscribe((res) => {
      expect(res).toEqual(mockResponse);
      expect(res.nome).toContain('Atualizada');
    });
    const req = httpMock.expectOne(`${environment.api_url}/tutores/${tutorId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockPayload);
    req.flush(mockResponse);
  });

  it('deve propagar erro quando a atualização falhar (400 Bad Request)', () => {
    const tutorId = 1;
    const invalidPayload: any = { nome: '' };

    service.update(tutorId, invalidPayload).subscribe({
      next: () => fail('Deveria ter falhado com erro 400'),
      error: (error) => {
        expect(error.status).toBe(400);
      }
    });

    const req = httpMock.expectOne(`${environment.api_url}/tutores/${tutorId}`);
    req.flush('Dados inválidos', { status: 400, statusText: 'Bad Request' });
  });
});