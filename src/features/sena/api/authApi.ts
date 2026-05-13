/**
 * SENA Auth API client (AA5-EV01)
 *
 * Cliente HTTP para los endpoints de autenticación del backend SENA.
 * Sigue la misma estructura que `plantsApi.ts` para que sea claro que
 * ambos consumen la misma "API REST" expuesta por el servidor Express.
 *
 * @module features/sena/api/authApi
 */

import { SENA_API_BASE_URL } from "./plantsApi";

/** Respuesta estándar del backend para auth. */
export interface AuthResponse {
  success: boolean;
  message: string;
  user?: { id: number; username: string };
}

/**
 * Registra un nuevo usuario en el backend.
 *
 * @param username nombre de usuario único (≥ 3 caracteres).
 * @param password contraseña en texto plano (≥ 6 caracteres). El backend la hashea.
 * @param email    correo electrónico opcional con formato válido.
 * @returns respuesta del backend con `success` y `message`.
 */
export async function registerUser(
  username: string,
  password: string,
  email?: string
): Promise<AuthResponse> {
  const response = await fetch(`${SENA_API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, email }),
  });
  return (await response.json()) as AuthResponse;
}

/**
 * Intenta autenticar a un usuario contra el backend.
 *
 * @param username nombre de usuario.
 * @param password contraseña en texto plano.
 * @returns respuesta del backend con `success`, `message` y `user` si éxito.
 */
export async function loginUser(username: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${SENA_API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return (await response.json()) as AuthResponse;
}

/**
 * Verifica que la API de auth esté disponible.
 *
 * @returns objeto `{ status }` del backend.
 */
export async function getAuthStatus(): Promise<{ status: string }> {
  const response = await fetch(`${SENA_API_BASE_URL}/auth/status`);
  return (await response.json()) as { status: string };
}
