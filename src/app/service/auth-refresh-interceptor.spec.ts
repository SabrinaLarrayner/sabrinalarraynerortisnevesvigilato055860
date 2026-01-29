import { TestBed } from '@angular/core/testing';

import { AuthRefreshInterceptor } from './auth-refresh-interceptor';

describe('AuthRefreshInterceptor', () => {
  let service: AuthRefreshInterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthRefreshInterceptor);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
