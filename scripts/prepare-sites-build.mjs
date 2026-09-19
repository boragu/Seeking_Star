#!/usr/bin/env node
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const index = path.join(dist, "client", "index.html");
const workerDirectory = path.join(root, "worker");
const worker = path.join(workerDirectory, "index.js");
const hosting = path.join(root, ".openai", "hosting.json");
const workerFiles = [
  "index.js",
  "openapi.js",
  "api/recommendations.js",
  "config/regions.js",
  "lib/normalizers.js",
  "lib/public-data-client.js",
  "lib/public-data-registry.js",
];

for (const file of [index, worker, hosting]) {
  if (!existsSync(file)) throw new Error("Missing Sites build input: " + file);
}

mkdirSync(path.join(dist, "server"), { recursive: true });
mkdirSync(path.join(dist, ".openai"), { recursive: true });
for (const relativeFile of workerFiles) {
  const source = path.join(workerDirectory, relativeFile);
  const target = path.join(dist, "server", relativeFile);
  if (!existsSync(source)) throw new Error("Missing Worker module: " + source);
  mkdirSync(path.dirname(target), { recursive: true });
  copyFileSync(source, target);
}
copyFileSync(hosting, path.join(dist, ".openai", "hosting.json"));

console.log("Prepared Sites build: modular worker and hosting manifest");
