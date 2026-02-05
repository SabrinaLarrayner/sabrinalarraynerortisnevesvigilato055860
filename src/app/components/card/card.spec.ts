import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Card } from './card';
import { By } from '@angular/platform-browser';

describe('Card', () => {
  let component: Card;
  let fixture: ComponentFixture<Card>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Card]
    }).compileComponents();

    fixture = TestBed.createComponent(Card);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve renderizar o container do card', () => {
    const card = fixture.debugElement.query(By.css('div'));
    expect(card).toBeTruthy();
  });

  it('deve projetar conteúdo via ng-content', () => {
    fixture.nativeElement.innerHTML = `
      <app-card>
        <p class="content">Conteúdo do card</p>
      </app-card>
    `;

    fixture.detectChanges();

    const content = fixture.nativeElement.querySelector('.content');
    expect(content).toBeTruthy();
    expect(content.textContent).toContain('Conteúdo do card');
  });

  it('deve conter as classes base do card', () => {
    const card = fixture.debugElement.query(By.css('div')).nativeElement;

    expect(card.classList.contains('bg-white')).toBe(true);
    expect(card.classList.contains('rounded-[32px]')).toBe(true);
    expect(card.classList.contains('shadow-sm')).toBe(true);
    expect(card.classList.contains('border')).toBe(true);
  });
});
