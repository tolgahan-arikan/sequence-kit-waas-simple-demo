import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { WagmiProvider, createConfig, http } from "wagmi";
import {
  Chain,
  arbitrumNova,
  arbitrumSepolia,
  mainnet,
  polygon,
} from "wagmi/chains";
import { sequence } from "0xsequence";
import { getDefaultWaasConnectors } from "@0xsequence/kit-connectors";
import { KitConfig, KitProvider } from "@0xsequence/kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const chains: readonly [Chain, ...Chain[]] = [
  arbitrumNova as Chain,
  arbitrumSepolia as Chain,
  mainnet as Chain,
  polygon as Chain,
];

// replace with your keys, and better to use env vars
const projectAccessKey = "EeP6AmufRFfigcWaNverI6CAAAAAAAAAA";
const waasConfigKey =
  "eyJwcm9qZWN0SWQiOjIsImVtYWlsUmVnaW9uIjoidXMtZWFzdC0yIiwiZW1haWxDbGllbnRJZCI6IjVncDltaDJmYnFiajhsNnByamdvNzVwMGY2IiwicnBjU2VydmVyIjoiaHR0cHM6Ly9uZXh0LXdhYXMuc2VxdWVuY2UuYXBwIn0=";
const googleClientId =
  "970987756660-35a6tc48hvi8cev9cnknp0iugv9poa23.apps.googleusercontent.com";
const appleClientId = "com.horizon.sequence.waas";
const appleRedirectURI = "https://" + window.location.host;

const connectors = [
  ...getDefaultWaasConnectors({
    walletConnectProjectId: "c65a6cb1aa83c4e24500130f23a437d8",
    defaultChainId: 42170,
    waasConfigKey,
    googleClientId,
    appleClientId,
    appleRedirectURI,
    appName: "Kit Demo",
    projectAccessKey,
    enableConfirmationModal: false,
  }),
];

/* @ts-expect-error-next-line */
const transports: Record<number, HttpTransport> = {};

chains.forEach((chain) => {
  const network = sequence.network.findNetworkConfig(
    sequence.network.allNetworks,
    chain.id
  );
  if (!network) return;

  transports[chain.id] = http(network.rpcUrl);
});

const config = createConfig({
  transports,
  chains,
  connectors,
});

const kitConfig: KitConfig = {
  defaultTheme: "dark",
  signIn: {
    projectName: "Kit Demo",
  },
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <KitProvider config={kitConfig}>
          <App />
        </KitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
