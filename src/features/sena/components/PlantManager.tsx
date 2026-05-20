/**
 * PlantManager component (AA3-EV01, AA4-EV03, AA5-EV03)
 *
 * Componente React funcional que demuestra de forma íntegra los componentes
 * formativos de la GA7:
 *
 *  - **Componentes y JSX** (AA4-EV03): este archivo es un componente React.
 *  - **Eventos** (`onChange`, `onSubmit`, `onClick`).
 *  - **Estado local** con `useState`.
 *  - **Ciclo de vida** con `useEffect` para cargar las plantas al montar.
 *  - **Consumo de API REST** vía `fetch` (en `plantsApi.ts`).
 *  - **Validaciones en cliente** (campos requeridos, tipos numéricos).
 *
 * @module features/sena/components/PlantManager
 */

import { useCallback, useEffect, useState } from "react";
import {
  createPlant,
  deletePlant,
  getAllPlants,
  updatePlant,
  type SenaPlant,
  type SenaPlantInput,
} from "../api/plantsApi";

interface FormState {
  name: string;
  species: string;
  watering_frequency: string;
  notes: string;
}

const EMPTY_FORM: FormState = {
  name: "",
  species: "",
  watering_frequency: "",
  notes: "",
};

/**
 * Lee el formulario y produce un payload válido para la API.
 *
 * @param form estado del formulario.
 * @returns input listo para enviar.
 */
function toInput(form: FormState): SenaPlantInput {
  const watering = form.watering_frequency.trim();
  return {
    name: form.name.trim(),
    species: form.species.trim() || null,
    watering_frequency: watering === "" ? null : Number(watering),
    notes: form.notes.trim() || null,
  };
}

/**
 * PlantManager — UI completa de CRUD de plantas.
 */
export function PlantManager() {
  const [plants, setPlants] = useState<SenaPlant[]>([]);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  /** Carga el listado desde el backend. Se invoca al montar y tras cada mutación. */
  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getAllPlants();
      setPlants(data);
    } catch (error) {
      setFeedback({
        kind: "err",
        text: error instanceof Error ? error.message : "Error desconocido al cargar plantas",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Fetch-on-mount: sync with the SENA backend. The setState calls happen
    // inside refresh() but that's the canonical data-fetching pattern.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh();
  }, [refresh]);

  /** Limpia el formulario y sale del modo edición. */
  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
  };

  /** Submit del formulario: crea o actualiza según el modo. */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);

    // Validaciones en cliente — evidencia AA3-EV02.
    if (form.name.trim().length === 0) {
      setFeedback({ kind: "err", text: "El nombre es obligatorio." });
      return;
    }
    if (form.watering_frequency.trim() !== "") {
      const n = Number(form.watering_frequency);
      if (!Number.isFinite(n) || n <= 0) {
        setFeedback({ kind: "err", text: "La frecuencia de riego debe ser un número mayor a 0." });
        return;
      }
    }

    try {
      if (editingId === null) {
        await createPlant(toInput(form));
        setFeedback({ kind: "ok", text: "Planta creada correctamente." });
      } else {
        await updatePlant(editingId, toInput(form));
        setFeedback({ kind: "ok", text: "Planta actualizada correctamente." });
      }
      resetForm();
      await refresh();
    } catch (error) {
      setFeedback({
        kind: "err",
        text: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  };

  /** Activa el modo edición con los datos de la planta seleccionada. */
  const handleEdit = (plant: SenaPlant) => {
    setEditingId(plant.id);
    setForm({
      name: plant.name,
      species: plant.species ?? "",
      watering_frequency: plant.watering_frequency === null ? "" : String(plant.watering_frequency),
      notes: plant.notes ?? "",
    });
    setFeedback(null);
  };

  /** Elimina una planta tras confirmación del usuario. */
  const handleDelete = async (plant: SenaPlant) => {
    const ok = window.confirm(`¿Eliminar la planta "${plant.name}"?`);
    if (!ok) return;
    try {
      await deletePlant(plant.id);
      setFeedback({ kind: "ok", text: "Planta eliminada." });
      if (editingId === plant.id) resetForm();
      await refresh();
    } catch (error) {
      setFeedback({
        kind: "err",
        text: error instanceof Error ? error.message : "Error al eliminar",
      });
    }
  };

  return (
    <section style={{ padding: 16, color: "var(--color-text, #222)" }}>
      <h2 style={{ marginTop: 0 }}>Gestor de Plantas (CRUD)</h2>
      <p style={{ marginTop: 0, fontSize: 14 }}>
        Demostración de componente React con estado, eventos, ciclo de vida y consumo de la API REST
        del backend SENA (<code>http://localhost:3001</code>).
      </p>

      <form
        onSubmit={(event) => {
          void handleSubmit(event);
        }}
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          maxWidth: 720,
          marginBottom: 16,
        }}
      >
        <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span>Nombre*</span>
          <input
            type="text"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            placeholder="Ej: Girasol"
            required
          />
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span>Especie</span>
          <input
            type="text"
            value={form.species}
            onChange={(event) => setForm({ ...form, species: event.target.value })}
            placeholder="Ej: sunflower"
          />
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span>Frecuencia de riego (días)</span>
          <input
            type="number"
            min={1}
            value={form.watering_frequency}
            onChange={(event) => setForm({ ...form, watering_frequency: event.target.value })}
            placeholder="3"
          />
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span>Notas</span>
          <input
            type="text"
            value={form.notes}
            onChange={(event) => setForm({ ...form, notes: event.target.value })}
            placeholder="Maceta del balcón..."
          />
        </label>

        <div style={{ gridColumn: "1 / -1", display: "flex", gap: 8 }}>
          <button type="submit">{editingId === null ? "Crear planta" : "Guardar cambios"}</button>
          {editingId !== null && (
            <button type="button" onClick={resetForm}>
              Cancelar edición
            </button>
          )}
        </div>
      </form>

      {feedback && (
        <p
          role="status"
          style={{
            padding: "8px 12px",
            background: feedback.kind === "ok" ? "#dcfce7" : "#fee2e2",
            color: feedback.kind === "ok" ? "#166534" : "#991b1b",
            borderRadius: 4,
          }}
        >
          {feedback.text}
        </p>
      )}

      <h3>Plantas registradas {isLoading && "(cargando...)"}</h3>
      {plants.length === 0 ? (
        <p>No hay plantas todavía. Crea la primera con el formulario de arriba.</p>
      ) : (
        <table
          style={{
            width: "100%",
            maxWidth: 900,
            borderCollapse: "collapse",
            fontSize: 14,
          }}
        >
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>
              <th style={{ padding: 6 }}>ID</th>
              <th style={{ padding: 6 }}>Nombre</th>
              <th style={{ padding: 6 }}>Especie</th>
              <th style={{ padding: 6 }}>Riego (días)</th>
              <th style={{ padding: 6 }}>Notas</th>
              <th style={{ padding: 6 }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {plants.map((plant) => (
              <tr key={plant.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: 6 }}>{plant.id}</td>
                <td style={{ padding: 6 }}>{plant.name}</td>
                <td style={{ padding: 6 }}>{plant.species ?? "—"}</td>
                <td style={{ padding: 6 }}>{plant.watering_frequency ?? "—"}</td>
                <td style={{ padding: 6 }}>{plant.notes ?? "—"}</td>
                <td style={{ padding: 6, display: "flex", gap: 6 }}>
                  <button type="button" onClick={() => handleEdit(plant)}>
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      void handleDelete(plant);
                    }}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
