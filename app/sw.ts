/// <reference lib="webworker" />
import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { NetworkOnly, Serwist } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

// Nunca cachear streams de video ni hosts de Mux: deben ir siempre a la red.
const isVideoRequest = ({ url }: { url: URL }): boolean => {
  const videoHosts = [
    "stream.mux.com",
    "test-streams.mux.dev",
    "devstreaming-cdn.apple.com",
  ];
  return (
    videoHosts.includes(url.hostname) ||
    /\.(?:m3u8|ts|m4s|mp4|webm)$/i.test(url.pathname)
  );
};

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    { matcher: isVideoRequest, handler: new NetworkOnly() },
    ...defaultCache,
  ],
});

serwist.addEventListeners();
