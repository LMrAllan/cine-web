import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import type { Filme } from "../types";
import { getFilmes, createFilme, deleteFilme } from "../services/api";
import { filmeSchema, type FilmeFormData } from "../schemas/filmeSchema";
import { ZodError } from "zod";

type FilmeForm = FilmeFormData;
type FilmeFormErrors = Partial<Record<keyof FilmeFormData, string>>;

const initialFormState: FilmeForm = {
  titulo: "",
  sinopse: "",
  duracao: 0,
  classificacao: "",
  genero: "",
  dataInicioExibicao: "",
  dataFimExibicao: "",
};

function Filmes() {
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [form, setForm] = useState<FilmeForm>(initialFormState);
  const [errors, setErrors] = useState<FilmeFormErrors>({});
  const [loading, setLoading] = useState(false);

  async function carregarFilmes() {
    try {
      const dados = await getFilmes();
      setFilmes(dados);
    } catch (error) {
      console.error("Erro ao carregar filmes:", error);
    }
  }

  useEffect(() => {
    carregarFilmes();
  }, []);

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;

    setForm((prev) => {
      if (name === "duracao") {
        return { ...prev, duracao: Number(value) };
      }

      return {
        ...prev,
        [name]: value,
      } as FilmeForm;
    });

    setErrors((prev) => ({
      ...prev,
      [name as keyof FilmeFormData]: undefined,
    }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);

    try {
      const dadosValidados = filmeSchema.parse(form);

      await createFilme(dadosValidados);
      setForm(initialFormState);
      setErrors({});
      await carregarFilmes();
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors: FilmeFormErrors = {};

        error.issues.forEach((issue) => {
          const field = issue.path[0] as keyof FilmeFormData;
          if (!fieldErrors[field]) {
            fieldErrors[field] = issue.message;
          }
        });

        setErrors(fieldErrors);
      } else {
        console.error("Erro ao criar filme:", error);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id?: string) {
    if (!id) return;

    const confirmar = window.confirm(
      "Tem certeza que deseja excluir este filme?"
    );
    if (!confirmar) return;

    try {
      await deleteFilme(id);
      await carregarFilmes();
    } catch (error) {
      console.error("Erro ao excluir filme:", error);
    }
  }

  return (
    <div className="container-fluid mt-4 px-4">
      <h1 className="mb-4 text-center"></h1>
      <div className="row g-4">
        {/* Formulário de cadastro */}
        <div className="col-12 col-lg-4 col-xl-3 mb-4">
          <div className="card h-100">
            <div className="card-header">Cadastrar novo filme</div>
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Título</label>
                  <input
                    type="text"
                    name="titulo"
                    className={`form-control ${
                      errors.titulo ? "is-invalid" : ""
                    }`}
                    value={form.titulo}
                    onChange={handleChange}
                  />
                  {errors.titulo && (
                    <div className="invalid-feedback">{errors.titulo}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">Sinopse</label>
                  <textarea
                    name="sinopse"
                    className={`form-control ${
                      errors.sinopse ? "is-invalid" : ""
                    }`}
                    rows={3}
                    value={form.sinopse}
                    onChange={handleChange}
                  />
                  {errors.sinopse && (
                    <div className="invalid-feedback">{errors.sinopse}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">Classificação</label>
                  <input
                    type="text"
                    name="classificacao"
                    className="form-control"
                    value={form.classificacao ?? ""}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Duração (minutos)</label>
                  <input
                    type="number"
                    name="duracao"
                    className={`form-control ${
                      errors.duracao ? "is-invalid" : ""
                    }`}
                    value={form.duracao}
                    onChange={handleChange}
                    min={0}
                  />
                  {errors.duracao && (
                    <div className="invalid-feedback">{errors.duracao}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">Gênero</label>
                  <input
                    type="text"
                    name="genero"
                    className="form-control"
                    value={form.genero ?? ""}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Data início exibição</label>
                  <input
                    type="date"
                    name="dataInicioExibicao"
                    className="form-control"
                    value={form.dataInicioExibicao ?? ""}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Data fim exibição</label>
                  <input
                    type="date"
                    name="dataFimExibicao"
                    className="form-control"
                    value={form.dataFimExibicao ?? ""}
                    onChange={handleChange}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? "Salvando..." : "Cadastrar Filme"}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Listagem de filmes */}
        <div className="col-12 col-lg-8 col-xl-9">
          <div className="card h-100">
            <div className="card-header">Filmes cadastrados</div>
            <div className="card-body p-4">
              {filmes.length === 0 ? (
                <p>Nenhum filme cadastrado.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped table-hover align-middle table-bordered">
                    <thead>
                      <tr>
                        <th>Título</th>
                        <th>Gênero</th>
                        <th>Duração</th>
                        <th>Classificação</th>
                        <th style={{ width: "80px" }}>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filmes.map((filme) => (
                        <tr key={filme.id}>
                          <td>{filme.titulo}</td>
                          <td>{filme.genero}</td>
                          <td>{filme.duracao} min</td>
                          <td>{filme.classificacao}</td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDelete(filme.id)}
                              title="Excluir"
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </td>
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

export default Filmes;
