import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputField } from './input-field';
import { By } from '@angular/platform-browser';
import { FormControl, Validators } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideNgxMask } from 'ngx-mask';

describe('InputField', () => {
  let component: InputField;
  let fixture: ComponentFixture<InputField>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        InputField
      ],
      providers: [
        provideNgxMask()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(InputField);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('deve renderizar o mat-form-field', () => {
    fixture.detectChanges();
    const formField = fixture.debugElement.query(By.css('mat-form-field'));
    expect(formField).toBeTruthy();
  });

  it('deve exibir o label corretamente', () => {
    component.label = 'E-mail';
    fixture.detectChanges();

    const label = fixture.debugElement.query(By.css('mat-label'));
    expect(label.nativeElement.textContent).toContain('E-mail');
  });

  it('deve renderizar o input', () => {
    fixture.detectChanges();
    const input = fixture.debugElement.query(By.css('input'));
    expect(input).toBeTruthy();
  });

  it('deve renderizar o ícone somente quando icon for informado', () => {
    component.icon = 'email';
    fixture.detectChanges();

    const icon = fixture.debugElement.query(By.css('mat-icon'));
    expect(icon).toBeTruthy();
    expect(icon.nativeElement.textContent).toContain('email');
  });

  it('não deve renderizar o ícone quando icon estiver vazio', () => {
    component.icon = '';
    fixture.detectChanges();

    const icon = fixture.debugElement.query(By.css('mat-icon'));
    expect(icon).toBeNull();
  });

  it('deve exibir mensagem de erro quando o campo for obrigatório e inválido', () => {
    component.control = new FormControl('', Validators.required);
    component.control.markAsTouched();
    fixture.detectChanges();
    const error = fixture.debugElement.query(By.css('mat-error'));
    expect(error).toBeTruthy();
    expect(error.nativeElement.textContent).toContain('Este campo é obrigatório');
  });
});