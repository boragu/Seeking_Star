import type { Destination } from "../domain/types";

export type SourceStatus = "live" | "partial" | "error";

export interface ApiSource {
  id: string;
  label: string;
  status: SourceStatus;
  itemCount: number;
  errors: Array<{ code: string; message: string }>;
}

export interface RecommendationResponse {
  mode: "live" | "partial";
  generatedAt: string;
  query: {
    date: string | null;
    departureTime: string | null;
    origin: { latitude: number; longitude: number } | null;
    region: string;
    tourAreaCode: string;
    areaCd: string;
    signguCd: string;
    baseYm: string;
  };
  destinations: Destination[];
  sources: ApiSource[];
}

export interface ApiErrorPayload {
  error?: { code?: string; message?: string; details?: unknown };
}

export class ApiRequestError extends Error {
  code: string;
  status: number;

  constructor(message: string, code: string, status: number) {
    super(message);
    this.name = "ApiRequestError";
    this.code = code;
    this.status = status;
  }
}
