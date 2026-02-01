import { TestBed } from '@angular/core/testing';

import { authRefreshInterceptor } from './auth-refresh-interceptor';

describe('AuthRefreshInterceptor', () => {
  let service: typeof authRefreshInterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(authRefreshInterceptor);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
