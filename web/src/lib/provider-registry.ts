import { providers } from "@/providers";

const enabledMap = new Map<string, boolean>(
  providers.map((p) => [p.config.id, p.config.enabled])
);

export function getEnabledProviders() {
  return providers.filter((p) => enabledMap.get(p.config.id) !== false);
}

export function setProviderEnabled(id: string, enabled: boolean) {
  enabledMap.set(id, enabled);
}

export function getProviderStatus() {
  return providers.map((p) => ({
    id: p.config.id,
    name: p.config.name,
    enabled: enabledMap.get(p.config.id) !== false,
  }));
}
