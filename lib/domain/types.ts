export type RegistrationSource = "aitdk_whois" | "whois_freeaiapi" | "pg_cache";
export type TrafficSource = "aitdk";
export type ProviderName = "aitdk" | "whois_freeaiapi";

export interface TrafficMonthlyPoint {
  metricMonth: string; // YYYY-MM-01
  visits: number;
}

export interface ProviderStatus {
  provider: ProviderName;
  success: boolean;
  httpStatus: number | null;
  errorCode: string | null;
  errorMessage: string | null;
}

export interface DomainProfileOutput {
  domain: string;
  apexDomain: string;
  registrationDate: string | null;
  registrationPrefix: string | null;
  registrationSource: RegistrationSource | null;
  trafficLastMonth: number | null;
  trafficSeries: Array<{
    metricMonth: string; // YYYY-MM
    visits: number;
    source: TrafficSource;
    fetchedAt: string;
  }>;
  cache: {
    hit: boolean;
    stale: boolean;
    negative: boolean;
    refreshed: boolean;
  };
  providers: {
    aitdk: ProviderStatus;
    whois: ProviderStatus;
  };
  updatedAt: string | null;
}

export interface ResolveDomainOptions {
  forceRefresh?: boolean;
}

export interface AitdkFetchResult {
  success: boolean;
  httpStatus: number | null;
  errorCode: string | null;
  errorMessage: string | null;
  rawPayload: string | null;
  registrationDate: string | null;
  registrationPrefix: string | null;
  monthlyTraffic: TrafficMonthlyPoint[];
}

export interface WhoisFetchResult {
  success: boolean;
  httpStatus: number | null;
  errorCode: string | null;
  errorMessage: string | null;
  rawPayload: unknown;
  registrationDate: string | null;
  registrationPrefix: string | null;
}
