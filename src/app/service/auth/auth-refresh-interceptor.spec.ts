import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { authRefreshInterceptor } from './auth-refresh-interceptor';
import { AuthRefreshService } from './auth-refresh';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('authRefreshInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let refreshService: AuthRefreshService;
  let router: Router;

  beforeEach(() => {
    const refreshServiceMock = {
      execute: vi.fn()
    };

    const routerMock = {
      navigate: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authRefreshInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthRefreshService, useValue: refreshServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    refreshService = TestBed.inject(AuthRefreshService);
    router = TestBed.inject(Router);

    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve tentar fazer o refresh do token quando receber um erro 401', () => {
    localStorage.setItem('refresh_token', 'token-valido');
    const mockNewToken = { access_token: 'novo-token-gerado' };
    vi.spyOn(refreshService, 'execute').mockReturnValue(of(mockNewToken));
    httpClient.get('/data').subscribe();
    const req = httpMock.expectOne('/data');
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
    expect(refreshService.execute).toHaveBeenCalled();
    const retryReq = httpMock.expectOne('/data');
    expect(retryReq.request.headers.get('Authorization')).toBe('Bearer novo-token-gerado');
  });

  it('deve limpar localStorage e navegar para login se o refresh falhar', () => {
    localStorage.setItem('refresh_token', 'token-expirado');
    vi.spyOn(refreshService, 'execute').mockReturnValue(throwError(() => new Error('Refresh Fail')));

    httpClient.get('/data').subscribe({
        error: (err) => expect(err).toBeTruthy()
    });

    const req = httpMock.expectOne('/data');
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

    expect(localStorage.length).toBe(0);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('não deve tentar refresh se for a rota de login ou refresh', () => {
    localStorage.setItem('refresh_token', 'qualquer-coisa');
    const loginUrl = '/autenticacao/login';

    httpClient.post(loginUrl, {}).subscribe({
      error: (error) => expect(error.status).toBe(401)
    });

    const req = httpMock.expectOne(loginUrl);
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
    expect(refreshService.execute).not.toHaveBeenCalled();
  });
});