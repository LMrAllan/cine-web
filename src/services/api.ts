import type { Filme, Sala, Sessao, Ingresso } from "../types";

const API_BASE_URL = "http://localhost:3000";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`Erro HTTP: ${response.status}`);
  }

  return response.json();
}

// FILMES
export async function getFilmes(): Promise<Filme[]> {
  return request<Filme[]>(`${API_BASE_URL}/filmes`);
}

export async function createFilme(
  data: Omit<Filme, "id">
): Promise<Filme> {
  return request<Filme>(`${API_BASE_URL}/filmes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function deleteFilme(id: string): Promise<void> {
  await request<void>(`${API_BASE_URL}/filmes/${id}`, {
    method: "DELETE",
  });
}

// SALAS
export async function getSalas(): Promise<Sala[]> {
  return request<Sala[]>(`${API_BASE_URL}/salas`);
}

export async function createSala(
  data: Omit<Sala, "id">
): Promise<Sala> {
  return request<Sala>(`${API_BASE_URL}/salas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

// SESSÕES
export async function getSessoes(): Promise<Sessao[]> {
  return request<Sessao[]>(`${API_BASE_URL}/sessoes`);
}

export async function createSessao(
  data: Omit<Sessao, "id">
): Promise<Sessao> {
  return request<Sessao>(`${API_BASE_URL}/sessoes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

// INGRESSOS
export async function getIngressos(): Promise<Ingresso[]> {
  return request<Ingresso[]>(`${API_BASE_URL}/ingressos`);
}

export async function createIngresso(
  data: Omit<Ingresso, "id">
): Promise<Ingresso> {
  return request<Ingresso>(`${API_BASE_URL}/ingressos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
