import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function validateCpf(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const cpf = control.value?.toString().replace(/\D/g, '');
    if (!cpf) return null;
    const isInvalidLength = cpf.length !== 11;
    const isAllSameDigits = /^(\d)\1+$/.test(cpf);
    if (isInvalidLength || isAllSameDigits) {
      return { invalidCpf: true };
    }
    const digits = Array.from(cpf).map(Number);
    const calculateCheckDigit = (slice: number[]) => {
      const sum = slice
        .reverse()
        .reduce((acc, curr, index) => acc + curr * (index + 2), 0);
      const remainder = (sum * 10) % 11;
      return remainder >= 10 ? 0 : remainder;
    };
    const firstCheckDigit = calculateCheckDigit(digits.slice(0, 9));
    const secondCheckDigit = calculateCheckDigit(digits.slice(0, 10));
    const hasValidDigits = firstCheckDigit === digits[9] && secondCheckDigit === digits[10];

    return hasValidDigits ? null : { invalidCpf: true };
  };
}