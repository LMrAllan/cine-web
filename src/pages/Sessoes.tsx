import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import type { Filme, Sala, Sessao } from "../types";
import {
  getFilmes,
  getSalas,
  getSessoes,
  createSessao,
  createIngresso,
} from "../services/api";
import { sessaoSchema, type SessaoFormData } from "../schemas/sessaoSchema";
import { ingressoSchema, type IngressoFormData } from "../schemas/ingressoSchema";
import { ZodError } from "zod";

type SessaoForm = SessaoFormData;
type SessaoFormErrors = Partial<Record<keyof SessaoFormData, string>>;

type IngressoForm = IngressoFormData;
type IngressoFormErrors = Partial<Record<keyof IngressoFormData, string>>;

const initialSessaoForm: SessaoForm = {
  filmeId: "",
  salaId: "",
  dataHora: "",
};

const initialIngressoForm: IngressoForm = {
  sessaoId: "",
  tipo: "INTEIRA",
  valor: 0,
};

function Sessoes() {
  const [sessoes, setSessoes] = useState<Sessao[]>([]);
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [salas, setSalas] = useState<Sala[]>([]);
  const [form, setForm] = useState<SessaoForm>(initialSessaoForm);
  const [errors, setErrors] = useState<SessaoFormErrors>({});
  const [loading, setLoading] = useState(false);

  // Estado para venda de ingresso
  const [sessaoSelecionada, setSessaoSelecionada] = useState<Sessao | null>(
    null
  );
  const [vendaForm, setVendaForm] =
    useState<IngressoForm>(initialIngressoForm);
  const [vendaErrors, setVendaErrors] =
    useState<IngressoFormErrors>({});
  const [salvandoVenda, setSalvandoVenda] = useState(false);

  async function carregarDados() {
    try {
      const [listaFilmes, listaSalas, listaSessoes] = await Promise.all([
        getFilmes(),
        getSalas(),
        getSessoes(),
      ]);
      setFilmes(listaFilmes);
      setSalas(listaSalas);
      setSessoes(listaSessoes);
    } catch (error) {
      console.error("Erro ao carregar dados das sessões:", error);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  function handleChangeSessao(
    event: ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value, // tudo string
    }));

    setErrors((prev) => ({
      ...prev,
      [name as keyof SessaoFormData]: undefined,
    }));
  }

  async function handleSubmitSessao(event: FormEvent) {
    event.preventDefault();
    setLoading(true);

    try {
      const dadosValidados = sessaoSchema.parse(form);

      const payload: Omit<Sessao, "id"> = {
        filmeId: dadosValidados.filmeId,
        salaId: dadosValidados.salaId,
        dataHora: dadosValidados.dataHora,
      };

      await createSessao(payload);
      setForm(initialSessaoForm);
      setErrors({});
      await carregarDados();
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors: SessaoFormErrors = {};

        error.issues.forEach((issue) => {
          const field = issue.path[0] as keyof SessaoFormData;
          if (!fieldErrors[field]) {
            fieldErrors[field] = issue.message;
          }
        });

        setErrors(fieldErrors);
      } else {
        console.error("Erro ao criar sessão:", error);
      }
    } finally {
      setLoading(false);
    }
  }

  function formatarDataHora(valor: string) {
    if (!valor) return "";
    const data = new Date(valor);
    if (Number.isNaN(data.getTime())) return valor;

    return data.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // -------- Venda de ingresso --------

  function handleAbrirVenda(sessao: Sessao) {
    if (!sessao.id) {
      alert("Sessão inválida (sem ID).");
      return;
    }

    setSessaoSelecionada(sessao);
    setVendaForm({
      sessaoId: sessao.id,
      tipo: "INTEIRA",
      valor: 0,
    });
    setVendaErrors({});
  }

  function handleCancelarVenda() {
    setSessaoSelecionada(null);
    setVendaForm(initialIngressoForm);
    setVendaErrors({});
  }

  function handleChangeVenda(
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = event.target;

    setVendaForm((prev) => ({
      ...prev,
      [name]:
        name === "valor" ? Number(value) : (value as IngressoForm["tipo"]),
    }));

    setVendaErrors((prev) => ({
      ...prev,
      [name as keyof IngressoFormData]: undefined,
    }));
  }

  async function handleSubmitVenda(event: FormEvent) {
    event.preventDefault();

    if (!sessaoSelecionada || !sessaoSelecionada.id) {
      alert("Selecione uma sessão válida.");
      return;
    }

    setSalvandoVenda(true);

    try {
      const dadosParaValidar: IngressoFormData = {
        sessaoId: sessaoSelecionada.id,
        tipo: vendaForm.tipo,
        valor: Number(vendaForm.valor),
      };

      const dadosValidados = ingressoSchema.parse(dadosParaValidar);

      await createIngresso(dadosValidados);

      alert("Ingresso registrado com sucesso!");

      setSessaoSelecionada(null);
      setVendaForm(initialIngressoForm);
      setVendaErrors({});
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors: IngressoFormErrors = {};

        error.issues.forEach((issue) => {
          const field = issue.path[0] as keyof IngressoFormData;
          if (!fieldErrors[field]) {
            fieldErrors[field] = issue.message;
          }
        });

        setVendaErrors(fieldErrors);
      } else {
        console.error("Erro ao registrar ingresso:", error);
      }
    } finally {
      setSalvandoVenda(false);
    }
  }

  // -----------------------------------

  return (
    <div className="container-fluid mt-4 px-4">
      <h1 className="mb-4 text-center"></h1>
      <div className="row g-4">
        {/* Formulário de agendamento de sessão */}
        <div className="col-12 col-lg-4 col-xl-3 mb-4">
          <div className="card h-100">
            <div className="card-header">Agendar sessão</div>
            <div className="card-body p-4">
              <form onSubmit={handleSubmitSessao}>
                {/* Select Filme */}
                <div className="mb-3">
                  <label className="form-label">Filme</label>
                  <select
                    name="filmeId"
                    className={`form-select ${
                      errors.filmeId ? "is-invalid" : ""
                    }`}
                    value={form.filmeId}
                    onChange={handleChangeSessao}
                  >
                    <option value="">Selecione um filme</option>
                    {filmes.map((filme) => (
                      <option key={filme.id} value={filme.id}>
                        {filme.titulo}
                      </option>
                    ))}
                  </select>
                  {errors.filmeId && (
                    <div className="invalid-feedback">{errors.filmeId}</div>
                  )}
                </div>

                {/* Select Sala */}
                <div className="mb-3">
                  <label className="form-label">Sala</label>
                  <select
                    name="salaId"
                    className={`form-select ${
                      errors.salaId ? "is-invalid" : ""
                    }`}
                    value={form.salaId}
                    onChange={handleChangeSessao}
                  >
                    <option value="">Selecione uma sala</option>
                    {salas.map((sala) => (
                      <option key={sala.id} value={sala.id}>
                        Sala {sala.numero} (capacidade {sala.capacidade})
                      </option>
                    ))}
                  </select>
                  {errors.salaId && (
                    <div className="invalid-feedback">{errors.salaId}</div>
                  )}
                </div>

                {/* Data e hora */}
                <div className="mb-3">
                  <label className="form-label">Data e hora</label>
                  <input
                    type="datetime-local"
                    name="dataHora"
                    className={`form-control ${
                      errors.dataHora ? "is-invalid" : ""
                    }`}
                    value={form.dataHora}
                    onChange={handleChangeSessao}
                  />
                  {errors.dataHora && (
                    <div className="invalid-feedback">{errors.dataHora}</div>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? "Salvando..." : "Agendar Sessão"}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Listagem de sessões */}
        <div className="col-12 col-lg-8 col-xl-9">
          <div className="card h-100">
            <div className="card-header">Sessões agendadas</div>
            <div className="card-body p-4">
              {sessoes.length === 0 ? (
                <p>Nenhuma sessão agendada.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped table-hover align-middle table-bordered">
                    <thead>
                      <tr>
                        <th>Filme</th>
                        <th>Sala</th>
                        <th>Data/Hora</th>
                        <th style={{ width: "150px" }}>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sessoes.map((sessao) => {
                        const filme = filmes.find(
                          (f) => f.id === sessao.filmeId
                        );
                        const sala = salas.find(
                          (s) => s.id === sessao.salaId
                        );

                        return (
                          <tr key={sessao.id}>
                            <td>
                              {filme ? filme.titulo : "Filme não encontrado"}
                            </td>
                            <td>
                              {sala ? `Sala ${sala.numero}` : "Sala não encontrada"}
                            </td>
                            <td>{formatarDataHora(sessao.dataHora)}</td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-sm btn-success me-2"
                                onClick={() => handleAbrirVenda(sessao)}
                              >
                                <i className="bi bi-ticket-perforated me-1"></i>
                                Vender ingresso
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Card de venda de ingresso */}
      {sessaoSelecionada && (
       <div className="row justify-content-center mt-4">
          <div className="col-12 col-md-10 col-lg-6">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <span>Venda de ingresso</span>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  onClick={handleCancelarVenda}
                >
                  Fechar
                </button>
              </div>
              <div className="card-body">
                {(() => {
                  const filme = filmes.find(
                    (f) => f.id === sessaoSelecionada.filmeId
                  );
                  const sala = salas.find(
                    (s) => s.id === sessaoSelecionada.salaId
                  );

                  return (
                    <>
                      <p>
                        <strong>Filme:</strong>{" "}
                        {filme ? filme.titulo : "Não encontrado"}
                      </p>
                      <p>
                        <strong>Sala:</strong>{" "}
                        {sala ? sala.numero : "Não encontrada"}
                      </p>
                      <p>
                        <strong>Data/Hora:</strong>{" "}
                        {formatarDataHora(sessaoSelecionada.dataHora)}
                      </p>
                    </>
                  );
                })()}

                <form onSubmit={handleSubmitVenda}>
                  <div className="mb-3">
                    <label className="form-label">Tipo de ingresso</label>
                    <select
                      name="tipo"
                      className={`form-select ${
                        vendaErrors.tipo ? "is-invalid" : ""
                      }`}
                      value={vendaForm.tipo}
                      onChange={handleChangeVenda}
                    >
                      <option value="INTEIRA">Inteira</option>
                      <option value="MEIA">Meia</option>
                    </select>
                    {vendaErrors.tipo && (
                      <div className="invalid-feedback">
                        {vendaErrors.tipo}
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Valor (R$)</label>
                    <input
                      type="number"
                      name="valor"
                      className={`form-control ${
                        vendaErrors.valor ? "is-invalid" : ""
                      }`}
                      value={vendaForm.valor}
                      onChange={handleChangeVenda}
                      min={0}
                      step="0.01"
                    />
                    {vendaErrors.valor && (
                      <div className="invalid-feedback">
                        {vendaErrors.valor}
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="btn btn-success w-100"
                    disabled={salvandoVenda}
                  >
                    {salvandoVenda
                      ? "Registrando..."
                      : "Registrar venda de ingresso"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Sessoes;
