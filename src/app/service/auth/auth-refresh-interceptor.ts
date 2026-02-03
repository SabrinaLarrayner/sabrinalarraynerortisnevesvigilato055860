import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthRefreshService, BYPASS_LOGIC } from './auth-refresh'; 
import { catchError, switchMap, throwError, BehaviorSubject, filter, take, Observable } from 'rxjs';
import { Router } from '@angular/router';

let isRefreshing = false;
let refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

export const authRefreshInterceptor: HttpInterceptorFn = (req, next) => {
  const refreshService = inject(AuthRefreshService);
  const router = inject(Router);
  
  const hasRefreshToken = !!localStorage.getItem('refresh_token');

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const isHealthCheck = req.url.includes('pets?size=1');

      if (
        error.status === 401 && 
        !req.url.includes('/autenticacao/refresh') && 
        !req.url.includes('/autenticacao/login') &&
        !isHealthCheck &&
        hasRefreshToken
      ) {
        return handle401(req, next, refreshService, router);
      }

      return throwError(() => error);
    })
  );
};

function handle401(req: any, next: any, service: AuthRefreshService, router: Router): Observable<any> {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return service.execute().pipe(
      switchMap((res) => {
        isRefreshing = false;
        refreshTokenSubject.next(res.access_token);
        return next(req.clone({ setHeaders: { Authorization: `Bearer ${res.access_token}` } }));
      }),
      catchError((err) => {
        isRefreshing = false;
        localStorage.clear();
        router.navigate(['/login']);
        return throwError(() => err);
      })
    );
  }

  return refreshTokenSubject.pipe(
    filter(token => token !== null),
    take(1),
    switchMap((token) => next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })))
  );
}

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('access_token');
  
  if (req.url.includes('/autenticacao/refresh') || req.context.get(BYPASS_LOGIC)) {
    return next(req);
  }

  if (token) {
    const cloned = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(cloned);
  }
  return next(req);
};