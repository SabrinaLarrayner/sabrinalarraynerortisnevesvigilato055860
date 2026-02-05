import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailsPet } from './details-pet';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { of, BehaviorSubject } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Router } from '@angular/router';
import { PetFacade } from '@services/pet/pet.facade';

describe('DetailsPet (Vitest)', () => {
  let component: DetailsPet;
  let fixture: ComponentFixture<DetailsPet>;

  const mockPet = {
    id: 2,
    nome: 'Thor',
    raca: 'Golden Retriever',
    idade: 3,
    foto: { url: 'foto-thor.jpg' },
    tutores: [
      { id: 10, nome: 'Sabrina', telefone: '6599999999', endereco: 'Cuiabá' }
    ]
  };

  const petSubject = new BehaviorSubject(mockPet);

  const mockPetFacade = {
    getById: vi.fn(),
    clearState: vi.fn(),
    delete: vi.fn().mockReturnValue(of({})),
    loading$: of(false),
    petSelected$: petSubject.asObservable()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsPet, NoopAnimationsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: PetFacade, useValue: mockPetFacade },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => '2' } }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailsPet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve instanciar o componente e carregar os detalhes do pet', () => {
    expect(component).toBeTruthy();
    expect(mockPetFacade.getById).toHaveBeenCalledWith(2);
  });

  it('deve exibir o nome do pet corretamente no HTML', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Thor');
  });

  it('deve mostrar a idade e a label correta (plural)', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.text-6xl')?.textContent).toContain('3');
    expect(component.getYearsLabel(3)).toBe('anos');
  });

  it('deve abrir e fechar o modal ao clicar nos botões', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const buttons = compiled.querySelectorAll('app-button');
    const excluirBtn = Array.from(buttons)
      .find(btn => btn.textContent?.includes('Excluir'));
    expect(excluirBtn).toBeTruthy();
    excluirBtn!.dispatchEvent(new Event('click'));
    fixture.detectChanges();
    expect(compiled.querySelector('h2')?.textContent)
      .toContain('Excluir Pet?');
    const cancelarBtn = Array.from(
      compiled.querySelectorAll('app-button')
    ).find(btn => btn.textContent?.includes('Cancelar'));
    expect(cancelarBtn).toBeTruthy();
    cancelarBtn!.dispatchEvent(new Event('click'));
    fixture.detectChanges();
    expect(compiled.querySelector('h2')).toBeNull();
  });

  it('deve navegar para a rota de edição ao clicar no botão Editar', async () => {
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const buttons = Array.from(compiled.querySelectorAll('app-button'));
    const editBtn = buttons.find(btn =>
      btn.textContent?.includes('Editar')
    );
    expect(editBtn).toBeTruthy();
    editBtn!.dispatchEvent(new Event('click'));
    fixture.detectChanges();
    expect(navigateSpy).toHaveBeenCalledWith([
      '/details-pet',
      mockPet.id,
      'edit'
    ]);
  });
  
  it('deve excluir o pet, fechar o modal e voltar para a lista', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate');
    component.showDeleteModal = true;
    component.confirmDelete(2);
    expect(mockPetFacade.delete).toHaveBeenCalledWith(2);
    expect(component.showDeleteModal).toBe(false);
    expect(navigateSpy).toHaveBeenCalledWith(['/list-pets']);
  });
  

  it('deve limpar o estado ao destruir o componente', () => {
    component.ngOnDestroy();
    expect(mockPetFacade.clearState).toHaveBeenCalled();
  });
});
