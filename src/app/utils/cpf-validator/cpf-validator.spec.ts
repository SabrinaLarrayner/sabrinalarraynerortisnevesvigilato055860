import { FormControl } from '@angular/forms';
import { validateCpf } from './cpf-validator';

describe('validateCpf', () => {
  let validatorFn: ReturnType<typeof validateCpf>;

  beforeEach(() => {
    validatorFn = validateCpf();
  });

  it('should return null for valid CPF', () => {
    const control = new FormControl('123.456.789-09');
    const result = validatorFn(control);
    expect(result).toBeNull();
  });

  it('should return invalidCpf for CPF with wrong length', () => {
    const control = new FormControl('123.456.789');
    const result = validatorFn(control);
    expect(result).toEqual({ invalidCpf: true });
  });

  it('should return invalidCpf for CPF with all same digits', () => {
    const control = new FormControl('111.111.111-11');
    const result = validatorFn(control);
    expect(result).toEqual({ invalidCpf: true });
  });

  it('should return invalidCpf for CPF with invalid check digits', () => {
    const control = new FormControl('123.456.789-00'); 
    const result = validatorFn(control);
    expect(result).toEqual({ invalidCpf: true });
  });

  it('should return null for empty value', () => {
    const control = new FormControl('');
    const result = validatorFn(control);
    expect(result).toBeNull();
  });
});
