import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpfValidator } from './cpf-validator';

describe('CpfValidator', () => {
  let component: CpfValidator;
  let fixture: ComponentFixture<CpfValidator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CpfValidator]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CpfValidator);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
