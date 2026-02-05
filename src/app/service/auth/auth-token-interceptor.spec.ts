import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { authTokenInterceptor } from './auth-token-interceptor';
import { AuthFacade } from './auth.facade';

describe('authTokenInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let authFacadeSpy: any;

  beforeEach(() => {
    authFacadeSpy = {
      getAccessToken: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authTokenInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthFacade, useValue: authFacadeSpy }
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve adicionar o cabeçalho Authorization quando o token existir', () => {
    const mockToken = 'meu-token-123';
    authFacadeSpy.getAccessToken.mockReturnValue(mockToken);
    httpClient.get('/api/test').subscribe();
    const req = httpMock.expectOne('/api/test');
    expect(req.request.headers.has('Authorization')).toBe(true);
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
    
    req.flush({});
  });

  it('não deve adicionar o cabeçalho Authorization quando o token for nulo', () => {
    authFacadeSpy.getAccessToken.mockReturnValue(null);
    httpClient.get('/api/test').subscribe();
    const req = httpMock.expectOne('/api/test');
    expect(req.request.headers.has('Authorization')).toBe(false);
    
    req.flush({});
  });

  it('deve chamar o next(req) e permitir que a requisição prossiga', () => {
    authFacadeSpy.getAccessToken.mockReturnValue('token');

    httpClient.get('/api/test').subscribe(response => {
      expect(response).toEqual({ data: 'ok' });
    });

    const req = httpMock.expectOne('/api/test');
    req.flush({ data: 'ok' });
  });
});