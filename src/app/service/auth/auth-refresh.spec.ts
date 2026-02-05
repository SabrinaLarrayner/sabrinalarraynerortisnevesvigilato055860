import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthRefreshService, BYPASS_LOGIC } from './auth-refresh';
import { environment } from '../../../environments/environment';
import { fail } from 'node:assert';

describe('AuthRefreshService', () => {
  let service: AuthRefreshService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthRefreshService]
    });

    service = TestBed.inject(AuthRefreshService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('deve executar o refresh com sucesso e atualizar o localStorage', () => {
    const mockRefreshToken = 'old-refresh-token';
    const mockResponse = {
      access_token: 'new-access-token',
      refresh_token: 'new-refresh-token'
    };

    localStorage.setItem('refresh_token', mockRefreshToken);

    service.execute().subscribe((res) => {
      expect(res).toEqual(mockResponse);
      expect(localStorage.getItem('access_token')).toBe(mockResponse.access_token);
      expect(localStorage.getItem('refresh_token')).toBe(mockResponse.refresh_token);
    });
    const req = httpMock.expectOne(`${environment.api_url}/autenticacao/refresh`);    
    expect(req.request.method).toBe('PUT');    
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockRefreshToken}`);
    expect(req.request.context.get(BYPASS_LOGIC)).toBe(true);
    req.flush(mockResponse);
  });

  it('deve propagar erro se a requisição falhar', () => {
    localStorage.setItem('refresh_token', 'token-invalido');

    service.execute().subscribe({
      next: () => fail('Deveria ter falhado'),
      error: (error) => {
        expect(error.status).toBe(403);
      }
    });

    const req = httpMock.expectOne(`${environment.api_url}/autenticacao/refresh`);
    req.flush('Erro de permissão', { status: 403, statusText: 'Forbidden' });
  });
});