import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { authGuard } from './auth-guard';

describe('authGuard', () => {
  let router: Router;

  const routerMock = {
    createUrlTree: vi.fn((path: string[]) => path)
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerMock }
      ]
    });

    router = TestBed.inject(Router);
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('deve permitir acesso (retornar true) se houver access_token no localStorage', () => {
    localStorage.setItem('access_token', 'token-valido');
    const result = TestBed.runInInjectionContext(() => 
      authGuard({} as any, {} as any)
    );

    expect(result).toBe(true);
  });

  it('deve retornar UrlTree para /login se NÃO houver token', () => {
    localStorage.removeItem('access_token');

    const result = TestBed.runInInjectionContext(() => 
      authGuard({} as any, {} as any)
    );
    expect(router.createUrlTree).toHaveBeenCalledWith(['/login']);
    expect(result).toEqual(['/login']);
  });
});