import { FormatPipe } from "./regex";

describe('FormatPipe', () => {
  let pipe: FormatPipe;

  beforeEach(() => {
    pipe = new FormatPipe();
  });

  it('should create the pipe', () => {
    expect(pipe).toBeTruthy();
  });

  it('should format phone with 11 digits', () => {
    const result = pipe.transform('11987654321', 'phone');
    expect(result).toBe('(11) 98765-4321');
  });

  it('should format phone with 10 digits', () => {
    const result = pipe.transform('1132654321', 'phone');
    expect(result).toBe('(11) 3265-4321');
  });

  it('should return default text if phone is undefined', () => {
    const result = pipe.transform(undefined, 'phone');
    expect(result).toBe('Sem telefone');
  });

  it('should format CPF correctly', () => {
    const result = pipe.transform('12345678901', 'cpf');
    expect(result).toBe('123.456.789-01');
  });

  it('should return default text if CPF is undefined', () => {
    const result = pipe.transform(undefined, 'cpf');
    expect(result).toBe('Não informado');
  });
});
