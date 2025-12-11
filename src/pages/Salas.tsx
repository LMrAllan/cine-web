import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import type { Sala } from "../types";
import { getSalas, createSala } from "../services/api";
import { salaSchema, type SalaFormData } from "../schemas/salaSchema";
import { ZodError } from "zod";

type SalaForm = SalaFormData;
type SalaFormErrors = Partial<Record<keyof SalaFormData, string>>;

const initialFormState: SalaForm = {
  numero: 0,
  capacidade: 0,
};

function Salas() {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [form, setForm] = useState<SalaForm>(initialFormState);
  const [errors, setErrors] = useState<SalaFormErrors>({});
  const [loading, setLoading] = useState(false);

  async function carregarSalas() {
    try {
      const dados = await getSalas();
      setSalas(dados);
    } catch (error) {
      console.error("Erro ao carregar salas:", error);
    }
  }

  useEffect(() => {
    carregarSalas();
  }, []);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: Number(value),
    }));

    setErrors((prev) => ({
      ...prev,
      [name as keyof SalaFormData]: undefined,
    }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);

    try {
      const dadosValidados = salaSchema.parse(form);

      await createSala(dadosValidados);
      setForm(initialFormState);
      setErrors({});
      await carregarSalas();
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors: SalaFormErrors = {};

        error.issues.forEach((issue) => {
          const field = issue.path[0] as keyof SalaFormData;
          if (!fieldErrors[field]) {
            fieldErrors[field] = issue.message;
          }
        });

        setErrors(fieldErrors);
      } else {
        console.error("Erro ao criar sala:", error);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-fluid mt-4 px-4">
      <h1 className="mb-4 text-center"></h1>
      <div className="row g-4">
        {/* Formulário de cadastro */}
        <div className="col-12 col-lg-4 col-xl-3 mb-4">
          <div className="card h-100">
            <div className="card-header">Cadastrar nova sala</div>
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Número da sala</label>
                  <input
                    type="number"
                    name="numero"
                    className={`form-control ${
                      errors.numero ? "is-invalid" : ""
                    }`}
                    value={form.numero}
                    onChange={handleChange}
                    min={0}
                  />
                  {errors.numero && (
                    <div className="invalid-feedback">{errors.numero}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">Capacidade máxima</label>
                  <input
                    type="number"
                    name="capacidade"
                    className={`form-control ${
                      errors.capacidade ? "is-invalid" : ""
                    }`}
                    value={form.capacidade}
                    onChange={handleChange}
                    min={0}
                  />
                  {errors.capacidade && (
                    <div className="invalid-feedback">
                      {errors.capacidade}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? "Salvando..." : "Cadastrar Sala"}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Listagem de salas */}
        <div className="col-12 col-lg-8 col-xl-9">
          <div className="card h-100">
            <div className="card-header">Salas cadastradas</div>
            <div className="card-body p-4">
              {salas.length === 0 ? (
                <p>Nenhuma sala cadastrada.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped table-hover align-middle table-bordered">
                    <thead>
                      <tr>
                        <th>Número</th>
                        <th>Capacidade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {salas.map((sala) => (
                        <tr key={sala.id}>
                          <td>{sala.numero}</td>
                          <td>{sala.capacidade}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Salas;
