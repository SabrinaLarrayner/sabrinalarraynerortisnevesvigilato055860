import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpContext, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { authTokenInterceptor } from './auth-refresh-interceptor';
import { BYPASS_LOGIC } from './auth-refresh';

describe('authTokenInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authTokenInterceptor])),
        provideHttpClientTesting()
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve adicionar o cabeçalho Authorization quando o token existir e não for rota de auth', () => {
    localStorage.setItem('access_token', 'token-valido');
    httpClient.get('/api/any').subscribe();

    const req = httpMock.expectOne('/api/any');
    expect(req.request.headers.has('Authorization')).toBe(true);
    req.flush({});
  });

  it('NÃO deve adicionar o cabeçalho Authorization em rotas de login', () => {
    localStorage.setItem('access_token', 'token-nao-deve-ir');
    const url = '/autenticacao/login';
    httpClient.post(url, {}, {
      context: new HttpContext().set(BYPASS_LOGIC, true)
    }).subscribe();
  
    const req = httpMock.expectOne(url);
    expect(req.request.headers.has('Authorization')).toBe(false);
  
    req.flush({});
  });
  
  it('NÃO deve adicionar o cabeçalho Authorization em rotas de refresh', () => {
    localStorage.setItem('access_token', 'token-nao-deve-ir');
  
    const url = '/autenticacao/refresh';
    httpClient.put(url, {}).subscribe();
  
    const req = httpMock.expectOne(url);
    expect(req.request.headers.has('Authorization')).toBe(false);
  
    req.flush({});
  });
  
  it('deve prosseguir sem o cabeçalho se o token não existir', () => {
    localStorage.removeItem('access_token');
    httpClient.get('/api/public').subscribe();

    const req = httpMock.expectOne('/api/public');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });
});