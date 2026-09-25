import type { DocumentRiskReport, DocumentHistoryItem, BenchmarkClause } from "../types";
import { getAuthToken } from "./firebase";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

async function getHeaders(isFormData = false): Promise<HeadersInit> {
  const headers: Record<string, string> = {};
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }
  const token = await getAuthToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

export async function analyzeContract(file: File, userId?: string): Promise<DocumentRiskReport> {
  const formData = new FormData();
  formData.append("file", file);
  if (userId) {
    formData.append("user_id", userId);
  }

  const headers = await getHeaders(true);
  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!response.ok) {
    let errorMsg = "Contract analysis failed";
    try {
      const err = await response.json();
      errorMsg = err.detail || errorMsg;
    } catch {
      // ignore
    }
    throw new Error(errorMsg);
  }

  return response.json();
}

export async function fetchDocumentReport(documentId: string, userId?: string): Promise<DocumentRiskReport> {
  const headers = await getHeaders();
  const url = new URL(`${API_BASE_URL}/documents/${documentId}`);
  if (userId) {
    url.searchParams.append("user_id", userId);
  }

  const response = await fetch(url.toString(), {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    throw new Error("Failed to load document report");
  }

  return response.json();
}

export async function fetchDocumentHistory(userId?: string): Promise<DocumentHistoryItem[]> {
  const headers = await getHeaders();
  const url = new URL(`${API_BASE_URL}/history`);
  if (userId) {
    url.searchParams.append("user_id", userId);
  }

  const response = await fetch(url.toString(), {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    throw new Error("Failed to load document history");
  }

  return response.json();
}

export async function fetchBenchmarks(category?: string): Promise<BenchmarkClause[]> {
  const headers = await getHeaders();
  const url = new URL(`${API_BASE_URL}/benchmarks`);
  if (category) {
    url.searchParams.append("category", category);
  }

  const response = await fetch(url.toString(), {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    return [];
  }

  return response.json();
}

export async function checkBackendHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return await response.json();
  } catch {
    return { status: "offline" };
  }
}
