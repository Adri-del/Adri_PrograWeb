import { describe, test, expect } from 'vitest';
import { hashPassword, comparePassword } from '../../../password.util';

describe('password.util - Pruebas de contraseñas', () => {
  const password1 = 'ClaveUno123!';
  const password2 = 'ClaveDos456!';

  test('debe generar hashes válidos y distintos al texto original', async () => {
    const hash1 = await hashPassword(password1);
    const hash2 = await hashPassword(password2);

    // Verificamos que sean cadenas con contenido
    expect(typeof hash1).toBe('string');
    expect(hash1.length).toBeGreaterThan(0);
    expect(hash1).not.toEqual(password1);

    expect(typeof hash2).toBe('string');
    expect(hash2.length).toBeGreaterThan(0);
    expect(hash2).not.toEqual(password2);
  });

  test('debe validar exitosamente cuando la contraseña coincide', async () => {
    const hash1 = await hashPassword(password1);
    const hash2 = await hashPassword(password2);

    const resultado1 = await comparePassword(password1, hash1);
    const resultado2 = await comparePassword(password2, hash2);

    expect(resultado1).toBe(true);
    expect(resultado2).toBe(true);
  });

  test('debe rechazar la comparación si las contraseñas son incorrectas', async () => {
    const hash1 = await hashPassword(password1);
    const hash2 = await hashPassword(password2);

    const cruce1 = await comparePassword(password2, hash1);
    const cruce2 = await comparePassword(password1, hash2);

    expect(cruce1).toBe(false);
    expect(cruce2).toBe(false);
  });
});

