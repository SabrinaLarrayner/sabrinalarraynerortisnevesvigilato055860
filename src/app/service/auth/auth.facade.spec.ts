import { TestBed } from '@angular/core/testing';
import { AuthFacade } from './auth.facade';
import { AuthService } from './auth';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('AuthFacade', () => {
  let service: AuthFacade;

  const authServiceMock = {
    login: vi.fn(),
    logout: vi.fn()
  };

  const routerMock = {
    navigate: vi.fn()
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthFacade,
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });

    service = TestBed.inject(AuthFacade);
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });
});
