import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Button } from './button';
import { MatIconModule } from '@angular/material/icon';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Button', () => {
  let component: Button;
  let fixture: ComponentFixture<Button>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Button, MatIconModule]
    }).compileComponents();

    fixture = TestBed.createComponent(Button);
    component = fixture.componentInstance;
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

  it('deve aplicar estado visual de desabilitado', () => {
    fixture.componentRef.setInput('variant', 'primary');
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
  
    const btn = fixture.debugElement.query(By.css('button'))
      .nativeElement as HTMLButtonElement;
  
    expect(btn.disabled).toBe(true);
    expect(btn.className).toContain('bg-gray-300');
    expect(btn.className).toContain('cursor-not-allowed');
    expect(btn.className).toContain('shadow-none');
  });
  it('deve emitir onClick quando clicado e NÃO estiver desabilitado', () => {
    const spy = vi.spyOn(component.onClick, 'emit');
    component.disabled = false;
    fixture.detectChanges();

    const btn = fixture.debugElement.query(By.css('button')).nativeElement as HTMLButtonElement;
  btn.click();

    expect(spy).toHaveBeenCalled();
  });
  it('NÃO deve emitir onClick quando o botão estiver desabilitado', () => {
    const spy = vi.spyOn(component.onClick, 'emit');
    component.disabled = true;
    fixture.detectChanges();

    const btn = fixture.debugElement.query(By.css('button'));
    btn.triggerEventHandler('click', null);

    expect(spy).not.toHaveBeenCalled();
  });
});