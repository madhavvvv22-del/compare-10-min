import type { ProviderAdapter } from "./types";
import { blinkitProvider } from "./mock-provider";
import { zeptoProvider } from "./mock-provider";
import { bigbasketProvider } from "./mock-provider";
import { instamartProvider } from "./mock-provider";

const providers: ProviderAdapter[] = [
  blinkitProvider,
  zeptoProvider,
  bigbasketProvider,
  instamartProvider,
];

export { providers, blinkitProvider, zeptoProvider, bigbasketProvider, instamartProvider };
export type { ProviderAdapter, ProviderConfig, SearchParams } from "./types";
