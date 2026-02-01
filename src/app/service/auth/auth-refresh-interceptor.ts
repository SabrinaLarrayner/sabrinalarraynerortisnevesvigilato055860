import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthRefreshService } from './auth-refresh';
import { catchError, switchMap, throwError, BehaviorSubject, filter, take, Observable } from 'rxjs';
import { Router } from '@angular/router';

let isRefreshing = false;
let refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

export const authRefreshInterceptor: HttpInterceptorFn = (req, next) => {
  const refreshService = inject(AuthRefreshService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/autenticacao/refresh')) {
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