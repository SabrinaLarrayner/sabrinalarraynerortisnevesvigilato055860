import { TestBed } from '@angular/core/testing';

import { AuthTokenInterceptor } from './auth-token-interceptor';

describe('AuthTokenInterceptor', () => {
  let service: AuthTokenInterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthTokenInterceptor);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
