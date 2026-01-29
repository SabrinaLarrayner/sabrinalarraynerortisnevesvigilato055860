import { HttpInterceptorFn, HttpErrorResponse, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthRefreshService } from './auth-refresh';
import { catchError, switchMap, throwError, BehaviorSubject, filter, take, retry, timer, Observable } from 'rxjs';
import { Router } from '@angular/router';

interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
}

let isRefreshing = false;
let refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

export const authRefreshInterceptor: HttpInterceptorFn = (req, next) => {
  const refreshService = inject(AuthRefreshService);
  const router = inject(Router);
  return next(req).pipe(
    retry({
      count: 1,
      delay: (error) => {
        if (error.status >= 500 || error.status === 0) return timer(1000);
        throw error;
      }
    }),
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/autenticacao/refresh')) {
        return handle401Error(req, next, refreshService, router);
      }
      if (error.status === 403) {
        alert('Você não tem permissão para realizar esta ação.');
      }
      if (error.status === 0 || error.status >= 500) {
        console.error('Erro de conexão ou servidor instável.');
      }
      return throwError(() => error);
    })
  );
};

// Função auxiliar para organizar o refresh
function handle401Error(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  refreshService: AuthRefreshService,
  router: Router
): Observable<HttpEvent<unknown>> {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return refreshService.execute().pipe(
      switchMap((res: RefreshTokenResponse) => {
        isRefreshing = false;
        refreshTokenSubject.next(res.access_token);
        return next(req.clone({
          setHeaders: { Authorization: `Bearer ${res.access_token}` }
        }));
      }),
      catchError((err) => {
        isRefreshing = false;
        localStorage.clear();
        router.navigate(['/login']);
        return throwError(() => err);
      })
    );
  } else {
    return refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap((token) => next(req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      })))
    );
  }
}
