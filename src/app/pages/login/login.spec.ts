import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Login } from './login';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { AuthFacade } from '../../service/auth/auth.facade';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideNgxMask } from 'ngx-mask';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;

  const mockAuthFacade = {
    login: vi.fn(),
    loading$: of(false)
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login, NoopAnimationsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        provideNgxMask(),
        { provide: AuthFacade, useValue: mockAuthFacade }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve instanciar o componente com sucesso', () => {
    expect(component).toBeTruthy();
  });

  it('deve permitir submeter com as credenciais admin/admin', () => {
    component.loginForm.patchValue({
      username: 'admin',
      password: 'admin'
    });

    expect(component.loginForm.valid).toBe(true);
    component.onSubmit();

    expect(mockAuthFacade.login).toHaveBeenCalledWith({
      username: 'admin',
      password: 'admin'
    });
  });

  it('deve alternar os estados de foco para as animações dos cachorros', () => {
    component.setLoginFocus(true);
    expect(component.isLoginFocused).toBe(true);
    
    component.setSenhaFocus(true);
    expect(component.isSenhaFocada).toBe(true);
  });

  it('deve desabilitar o botão se o formulário estiver vazio', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('button');
    expect(button?.disabled).toBe(true);
  });
});