import { describe, test, expect } from 'vitest';
import { generateSixDigitCode } from '../../../generateCode.util';

describe('generateCode.util - Generador de códigos', () => {
  test('debe retornar un código numérico de 6 dígitos', () => {
    const codigo = generateSixDigitCode();

    // Debe ser string y tener longitud 6
    expect(typeof codigo).toBe('string');
    expect(codigo).toHaveLength(6);

    // Comprobar que sea un número válido en el rango de 6 cifras
    const numero = Number(codigo);
    expect(Number.isNaN(numero)).toBe(false);
    expect(numero).toBeGreaterThanOrEqual(100000);
    expect(numero).toBeLessThanOrEqual(999999);
  });
});

