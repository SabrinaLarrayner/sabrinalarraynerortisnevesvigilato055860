import { HttpInterceptorFn } from '@angular/common/http';

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const isAuthRoute = req.url.includes('/autenticacao/login') || 
                      req.url.includes('/autenticacao/refresh');

  if (isAuthRoute) {
    return next(req);
  }
  const token = localStorage.getItem('access_token');
  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }
  return next(req);
};