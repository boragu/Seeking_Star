import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv, type Plugin } from "vite";
// The deployment worker is plain ESM so the same routing code runs in local development.
// @ts-expect-error JavaScript worker entry intentionally has no separate declaration file.
import worker from "./worker/index.js";

function localApiPlugin(bindings: Record<string, string>): Plugin {
  return {
    name: "stargazing-local-api",
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        const incoming = request as unknown as { url?: string; method?: string; headers: Record<string, string | string[] | undefined> };
        const outgoing = response as unknown as { statusCode: number; setHeader: (key: string, value: string) => void; end: (body?: Uint8Array) => void };
        if (!incoming.url?.startsWith("/api/")) return next();
        try {
          const host = Array.isArray(incoming.headers.host) ? incoming.headers.host[0] : incoming.headers.host;
          const origin = `http://${host ?? "localhost"}`;
          const workerResponse = await worker.fetch(new Request(new URL(incoming.url, origin), {
            method: incoming.method,
            headers: incoming.headers as HeadersInit,
          }), {
            ...bindings,
            ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
          });
          outgoing.statusCode = workerResponse.status;
          workerResponse.headers.forEach((value: string, key: string) => outgoing.setHeader(key, value));
          outgoing.end(new Uint8Array(await workerResponse.arrayBuffer()));
        } catch (error) {
          next(error as Error);
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const bindings = loadEnv(mode, ".", "") as Record<string, string>;
  return {
  build: {
    outDir: "dist/client",
  },
  css: {
    postcss: {
      plugins: [],
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom/client"],
  },
  server: {
    host: "0.0.0.0",
    allowedHosts: ["terminal.local"],
    warmup: {
      clientFiles: ["./src/main.tsx"],
    },
  },
  plugins: [react(), tailwindcss(), localApiPlugin(bindings)],
  };
});
