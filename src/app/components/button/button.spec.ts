import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Button } from './button';
import { MatIconModule } from '@angular/material/icon';
import { By } from '@angular/platform-browser';

describe('Button', () => {
  let component: Button;
  let fixture: ComponentFixture<Button>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Button, MatIconModule]
    }).compileComponents();

    fixture = TestBed.createComponent(Button);
    component = fixture.componentInstance;
    // Removido o fixture.detectChanges() daqui para evitar o erro NG0100
  });

  it('deve criar o componente', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('deve exibir o label corretamente', () => {
    component.label = 'Confirmar';
    fixture.detectChanges();
    
    const btnElement = fixture.debugElement.query(By.css('button')).nativeElement;
    expect(btnElement.textContent).toContain('Confirmar');
  });

  it('deve renderizar o ícone somente se showIcon for true', () => {
    component.showIcon = true;
    component.iconName = 'add';
    fixture.detectChanges();

    const icon = fixture.debugElement.query(By.css('mat-icon'));
    expect(icon).toBeTruthy();
    expect(icon.nativeElement.textContent).toContain('add');
  });
  it('deve aplicar estado visual de desabilitado', () => {
    component.disabled = true;
    component.variant = 'primary';
  
    fixture.detectChanges();
  
    const btn = fixture.debugElement.query(By.css('button')).nativeElement;
  
    expect(btn.disabled).toBe(true);
  
    expect(btn.classList.contains('bg-gray-300')).toBe(true);
    expect(btn.classList.contains('cursor-not-allowed')).toBe(true);
    expect(btn.classList.contains('shadow-none')).toBe(true);
  });
  
  
});