/**
 * SENA Plants API client (AA3-EV01, AA4-EV03, AA5-EV03)
 *
 * Cliente HTTP que consume el backend Express `sena-backend`. Es el
 * equivalente al cliente que consumiría una API REST / Web Service expuesto
 * por un proveedor SOAP o RESTful en el paradigma Java.
 *
 * Todas las funciones devuelven Promesas tipadas; los errores HTTP se
 * normalizan en una excepción `Error` con mensaje legible para que el
 * componente que las consume pueda mostrarlo al usuario.
 *
 * @module features/sena/api/plantsApi
 */

/** URL base del backend SENA. Cambiarla aquí afecta a todas las llamadas. */
export const SENA_API_BASE_URL = "http://localhost:3001/api";

/**
 * Representación de una planta tal como la entrega el backend.
 */
export interface SenaPlant {
  id: number;
  name: string;
  species: string | null;
  watering_frequency: number | null;
  last_watered: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string | null;
}

/**
 * Payload aceptado por el endpoint POST/PUT de plantas.
 * Todos los campos excepto `name` son opcionales.
 */
export interface SenaPlantInput {
  name: string;
  species?: string | null;
  watering_frequency?: number | null;
  last_watered?: string | null;
  notes?: string | null;
}

interface ApiEnvelope<T> {
  success: boolean;
  data?: T;
  message?: string;
}

/**
 * Lanza una excepción legible si la respuesta HTTP no es exitosa.
 *
 * @param response Respuesta cruda de fetch.
 * @param payload  Cuerpo JSON ya parseado.
 */
function ensureOk<T>(response: Response, payload: ApiEnvelope<T>): T {
  if (!response.ok || payload.success === false) {
    throw new Error(payload.message ?? `Error HTTP ${response.status}`);
  }
  if (payload.data === undefined) {
    // Algunos endpoints (DELETE) no devuelven `data`; los manejamos aparte.
    return undefined as unknown as T;
  }
  return payload.data;
}

/**
 * Obtiene el listado completo de plantas.
 *
 * @returns array de plantas ordenado por id descendente.
 */
export async function getAllPlants(): Promise<SenaPlant[]> {
  const response = await fetch(`${SENA_API_BASE_URL}/plants`);
  const payload = (await response.json()) as ApiEnvelope<SenaPlant[]>;
  return ensureOk(response, payload) ?? [];
}

/**
 * Obtiene una planta por su identificador.
 *
 * @param id identificador autoincremental.
 * @returns objeto SenaPlant.
 */
export async function getPlantById(id: number): Promise<SenaPlant> {
  const response = await fetch(`${SENA_API_BASE_URL}/plants/${id}`);
  const payload = (await response.json()) as ApiEnvelope<SenaPlant>;
  return ensureOk(response, payload);
}

/**
 * Crea una nueva planta.
 *
 * @param input datos de la planta (nombre obligatorio).
 * @returns planta creada con id asignado.
 */
export async function createPlant(input: SenaPlantInput): Promise<SenaPlant> {
  const response = await fetch(`${SENA_API_BASE_URL}/plants`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const payload = (await response.json()) as ApiEnvelope<SenaPlant>;
  return ensureOk(response, payload);
}

/**
 * Actualiza una planta existente.
 *
 * @param id    identificador de la planta.
 * @param input campos a actualizar (parciales).
 * @returns planta actualizada.
 */
export async function updatePlant(id: number, input: Partial<SenaPlantInput>): Promise<SenaPlant> {
  const response = await fetch(`${SENA_API_BASE_URL}/plants/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const payload = (await response.json()) as ApiEnvelope<SenaPlant>;
  return ensureOk(response, payload);
}

/**
 * Elimina una planta por id.
 *
 * @param id identificador de la planta.
 */
export async function deletePlant(id: number): Promise<void> {
  const response = await fetch(`${SENA_API_BASE_URL}/plants/${id}`, { method: "DELETE" });
  const payload = (await response.json()) as ApiEnvelope<never>;
  if (!response.ok || payload.success === false) {
    throw new Error(payload.message ?? `Error HTTP ${response.status}`);
  }
}
