import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DeleteTutor } from './delete-tutor';
import { environment } from '../../../environments/environment';
import { fail } from 'node:assert';

describe('DeleteTutor', () => {
  let service: DeleteTutor;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DeleteTutor]
    });

    service = TestBed.inject(DeleteTutor);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve ser criado corretamente', () => {
    expect(service).toBeTruthy();
  });

  it('deve chamar o endpoint de deleção com o ID correto via DELETE', () => {
    const tutorId = 123;
    service.execute(tutorId).subscribe((response) => {
      expect(response).toBeNull();
    });
    const req = httpMock.expectOne(`${environment.api_url}/tutores/${tutorId}`);
    
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('deve lidar com erro ao tentar deletar um tutor inexistente', () => {
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