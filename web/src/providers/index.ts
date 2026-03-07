import type { ProviderAdapter, ProviderConfig, SearchParams } from "./types";
import { blinkitProvider } from "./blinkit";
import { zeptoProvider } from "./zepto";
import { bigbasketProvider } from "./bigbasket";
import { instamartProvider } from "./instamart";

const providers: ProviderAdapter[] = [
  blinkitProvider,
  zeptoProvider,
  bigbasketProvider,
  instamartProvider,
];

export { providers, blinkitProvider, zeptoProvider, bigbasketProvider, instamartProvider };
export type { ProviderAdapter, ProviderConfig, SearchParams };
