import { HttpInterceptorFn } from '@angular/common/http';
export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('access_token');
  const isLoginRequest = req.url.includes('autenticacao/login');
  if (token && !isLoginRequest) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }
  return next(req);
};