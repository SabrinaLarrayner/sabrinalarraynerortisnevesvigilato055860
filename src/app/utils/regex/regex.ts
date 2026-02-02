import { Pipe, PipeTransform } from '@angular/core';

const FORMATTERS: Record<string, (val: string) => string> = {
  phone: (val) => val.length === 11
    ? val.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    : val.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3'),

  cpf: (val) => val.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4'),
};

@Pipe({
  name: 'format',
  standalone: true
})
export class FormatPipe implements PipeTransform {
  transform(value: string | number | undefined, type: keyof typeof FORMATTERS): string {
    if (!value) return type === 'phone' ? 'Sem telefone' : 'Não informado';
    const cleanValue = value.toString().replace(/\D/g, '');
    const formatter = FORMATTERS[type];
    return formatter ? formatter(cleanValue) : cleanValue;
  }
}