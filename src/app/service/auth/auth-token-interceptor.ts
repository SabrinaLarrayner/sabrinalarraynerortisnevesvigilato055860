import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthFacade } from './auth.facade';

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authFacade = inject(AuthFacade);

  const token = authFacade.getAccessToken();

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};
