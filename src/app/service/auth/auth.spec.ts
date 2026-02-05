import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    service = TestBed.inject(AuthService);
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });
});
