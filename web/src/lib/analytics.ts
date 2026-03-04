export interface SearchLog {
  query: string;
  location: string;
  timestamp: number;
  offerCount: number;
  failedProviders?: string[];
}

const logs: SearchLog[] = [];
const MAX_LOGS = 100;

export function logSearch(
  query: string,
  location: string,
  offerCount: number,
  failedProviders?: string[]
) {
  logs.unshift({
    query,
    location,
    timestamp: Date.now(),
    offerCount,
    failedProviders,
  });
  if (logs.length > MAX_LOGS) logs.pop();
}

export function getSearchLogs(): SearchLog[] {
  return [...logs];
}
