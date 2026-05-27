import { config } from '../config/loadConfig';
import type { AppConfig } from '../types/config';

const CACHE_KEY = 'dynamic-contact-details:app-config';
const MOCK_LATENCY_MS = 450;

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function readCachedConfig(): AppConfig | null {
  try {
    const cached = window.localStorage.getItem(CACHE_KEY);
    return cached ? (JSON.parse(cached) as AppConfig) : null;
  } catch {
    return null;
  }
}

function cacheConfig(appConfig: AppConfig) {
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(appConfig));
  } catch {
    // Caching is a performance enhancement, so the app can continue without it.
  }
}

export async function fetchAppConfig(): Promise<AppConfig> {
  await wait(MOCK_LATENCY_MS);

  try {
    cacheConfig(config);
    return config;
  } catch (error) {
    const cachedConfig = readCachedConfig();

    if (cachedConfig) {
      return cachedConfig;
    }

    throw error;
  }
}
