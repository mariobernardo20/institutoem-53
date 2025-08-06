/// <reference types="vite/client" />

declare global {
  interface Window {
    cstrEmbedLoaded?: boolean;
    cstrEmbed?: any;
  }
}

export {};
