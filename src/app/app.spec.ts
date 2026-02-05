import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { AuthFacade } from './service/auth/auth.facade';
import { Router } from '@angular/router';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('App', () => {
  const authFacadeMock = {
    checkApiHealth: vi.fn()
  };
  const routerMock = {
    navigate: vi.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        { provide: AuthFacade, useValue: authFacadeMock },
        { provide: Router, useValue: routerMock }
      ],
    }).compileComponents();
  });

  it('deve criar a aplicação', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('deve renderizar os elementos do dashboard', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges(); 
    await fixture.whenStable(); 
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const textoRenderizado = compiled.textContent;
    expect(textoRenderizado).toContain('Sistemas');
    expect(textoRenderizado).toContain('Instabilidade Detectada');
  });
});