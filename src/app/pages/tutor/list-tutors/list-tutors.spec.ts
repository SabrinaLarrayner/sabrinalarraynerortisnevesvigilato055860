import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListTutors } from './list-tutors';
import { TutorFacade } from '../../service/tutor/tutor.facade';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { vi } from 'vitest';
import { provideNgxMask } from 'ngx-mask';

describe('ListTutors', () => {
  let component: ListTutors;
  let fixture: ComponentFixture<ListTutors>;

  const mockTutorFacade = {
    listAll: vi.fn(),
    clearState: vi.fn(),
    tutorsList$: of({
      total: 0,
      content: []
    }),
    loading$: of(false)
  };

  const mockRouter = {
    navigate: vi.fn(),
    url: '/tutors' 
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [ListTutors, NoopAnimationsModule],
      providers: [
        provideNgxMask(),
        { provide: TutorFacade, useValue: mockTutorFacade },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListTutors);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar os tutores ao iniciar', () => {
    expect(mockTutorFacade.listAll).toHaveBeenCalledWith(0, 10, '');
  });

  it('deve buscar tutores ao digitar no campo de busca', async () => {
    vi.useFakeTimers();
    
    component.searchControl.setValue('Maria');
    vi.advanceTimersByTime(400);
    fixture.detectChanges();

    expect(mockTutorFacade.listAll).toHaveBeenCalledWith(0, 10, 'Maria');
    
    vi.useRealTimers();
  });

  it('deve tratar o evento de paginação', () => {
    component.handlePageEvent({
      pageIndex: 1,
      pageSize: 20,
      length: 100
    } as any);

    expect(component.currentPage).toBe(1);
    expect(component.pageSize).toBe(20);
    expect(mockTutorFacade.listAll).toHaveBeenCalledWith(1, 20, '');
  });

  it('deve navegar para criação de tutor', () => {
    component.navigateToCreate();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/create-tutor']);
  });

  it('deve navegar para detalhes do tutor', () => {
    component.detailsTutors(5);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/details-tutor', 5]);
  });

  it('deve limpar o estado ao destruir o componente', () => {
    component.ngOnDestroy();
    expect(mockTutorFacade.clearState).toHaveBeenCalled();
  });
});