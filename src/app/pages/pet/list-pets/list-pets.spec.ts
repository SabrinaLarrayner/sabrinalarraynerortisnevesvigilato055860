import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListPets } from './list-pets';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { vi } from 'vitest';
import { provideNgxMask } from 'ngx-mask';
import { PetFacade } from '@services/pet/pet.facade';

describe('ListPets', () => {
  let component: ListPets;
  let fixture: ComponentFixture<ListPets>;

  const mockPetFacade = {
    listAll: vi.fn(),
    clearState: vi.fn(),
    petsList$: of({
      total: 0,
      content: []
    })
  };

  const mockRouter = {
    navigate: vi.fn(),
    url: '/pets'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListPets, NoopAnimationsModule],
      providers: [
        { provide: PetFacade, useValue: mockPetFacade },
        { provide: Router, useValue: mockRouter },
        provideNgxMask()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListPets);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar os pets ao iniciar', () => {
    expect(mockPetFacade.listAll).toHaveBeenCalledWith(0, 10, '');
  });

  it('deve navegar para criação de pet', () => {
    component.navigateToCreate();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/create-pet']);
  });

  it('deve navegar para os detalhes do pet', () => {
    component.detailsPet(5);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/details-pet', 5]);
  });

  it('deve tratar o evento de paginação', () => {
    component.handlePageEvent({
      pageIndex: 1,
      pageSize: 20,
      length: 100
    } as any);

    expect(component.currentPage).toBe(1);
    expect(component.pageSize).toBe(20);
    expect(mockPetFacade.listAll).toHaveBeenCalledWith(1, 20, '');
  });

  it('deve limpar o estado ao destruir o componente', () => {
    component.ngOnDestroy();
    expect(mockPetFacade.clearState).toHaveBeenCalled();
  });

  it('deve retornar o plural correto para anos', () => {
    expect(component.yearsPlural(1)).toBe('ano');
    expect(component.yearsPlural(2)).toBe('anos');
  });
});
