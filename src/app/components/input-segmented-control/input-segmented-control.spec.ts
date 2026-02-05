import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputSegmentedControl } from './input-segmented-control';
import { By } from '@angular/platform-browser';

describe('InputSegmentedControl', () => {
  let component: InputSegmentedControl;
  let fixture: ComponentFixture<InputSegmentedControl>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputSegmentedControl]
    }).compileComponents();

    fixture = TestBed.createComponent(InputSegmentedControl);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('deve renderizar a quantidade correta de opções', () => {
    component.options = ['Opção 1', 'Opção 2', 'Opção 3'];
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('button'));
    expect(buttons.length).toBe(3);
    expect(buttons[0].nativeElement.textContent.trim()).toBe('Opção 1');
  });

  it('deve aplicar as classes de destaque apenas na opção selecionada', () => {
    component.options = ['A', 'B'];
    component.value = 'A';
    fixture.detectChanges();
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    expect(buttons[0].nativeElement.classList).toContain('bg-white');
    expect(buttons[1].nativeElement.classList).not.toContain('bg-white');
    expect(buttons[1].nativeElement.classList).toContain('text-purple-400');
  });

  it('deve emitir o novo valor e alterar a seleção ao clicar em uma opção', () => {
    component.options = ['Pets', 'Tutores'];
    component.value = 'Pets';
    fixture.detectChanges();
    const emitSpy = vi.spyOn(component.valueChange, 'emit');

    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const tutorButton = buttons[1];

    tutorButton.nativeElement.click();
    fixture.detectChanges();
    expect(component.value).toBe('Tutores');
    expect(emitSpy).toHaveBeenCalledWith('Tutores');
    expect(tutorButton.nativeElement.classList).toContain('bg-white');
  });

  it('deve manter a seleção atual se clicar na opção que já está selecionada', () => {
    component.options = ['Pets', 'Tutores'];
    component.value = 'Pets';
    fixture.detectChanges();

    const emitSpy = vi.spyOn(component.valueChange, 'emit');
    const petButton = fixture.debugElement.queryAll(By.css('button'))[0];

    petButton.nativeElement.click();
    
    expect(emitSpy).toHaveBeenCalledWith('Pets');
    expect(component.value).toBe('Pets');
  });
});