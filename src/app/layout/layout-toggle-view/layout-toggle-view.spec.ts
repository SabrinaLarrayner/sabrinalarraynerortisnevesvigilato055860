import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LayoutToggleView } from './layout-toggle-view';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { InputSegmentedControl } from '../../components/input-segmented-control/input-segmented-control';

describe('LayoutToggleView', () => {
  let component: LayoutToggleView;
  let fixture: ComponentFixture<LayoutToggleView>;
  let router: Router;
  const routerMock = {
    url: '/list-pets',
    navigate: vi.fn()
  };

  beforeEach(async () => {
    routerMock.navigate.mockClear();
    routerMock.url = '/list-pets';

    await TestBed.configureTestingModule({
      imports: [
        LayoutToggleView, 
        MatIconModule, 
        InputSegmentedControl
      ],
      providers: [
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutToggleView);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  it('deve criar o componente', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('deve inicializar isSelected como "Pets" se a URL for /list-pets', () => {
    fixture.detectChanges();
    expect(component.isSelected).toBe('Pets');
  });

  it('deve navegar para /list-pets quando onValueChange receber "Pets"', () => {
    component.onValueChange('Pets');
    expect(router.navigate).toHaveBeenCalledWith(['/list-pets']);
  });

  it('deve navegar para /list-tutors quando onValueChange receber "Tutores"', () => {
    component.onValueChange('Tutores');
    expect(router.navigate).toHaveBeenCalledWith(['/list-tutors']);
  });

  it('deve chamar o método logout e navegar para /login', () => {
    const logoutBtn = fixture.debugElement.query(By.css('button.hover\\:text-red-600'));
    logoutBtn.nativeElement.click();

    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('deve renderizar o container de projeção de conteúdo (ng-content)', () => {
    fixture.detectChanges();
    const contentDiv = fixture.debugElement.query(By.css('.max-w-7xl'));
    expect(contentDiv).toBeTruthy();
  });
  it('deve inicializar isSelected como "Tutores" se a URL contiver "tutors"', () => {
    routerMock.url = '/list-tutors';
    const newFixture = TestBed.createComponent(LayoutToggleView);
    const newComponent = newFixture.componentInstance;
    
    expect(newComponent.isSelected).toBe('Tutores');
  });
});