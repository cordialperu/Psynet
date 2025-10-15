import { build } from "esbuild";
import { rmSync, existsSync } from "fs";

// Only clean the server build file, not the entire dist directory
if (existsSync("dist/index.js")) {
  rmSync("dist/index.js", { force: true });
}

// Build server
await build({
  entryPoints: ["./server/index.ts"],
  bundle: true,
  platform: "node",
  target: "node20",
  format: "esm",
  outfile: "./dist/index.js",
  external: [
    "@neondatabase/serverless",
    "express",
    "bcrypt",
    "drizzle-orm",
    "nanoid",
    "lightningcss",
    "@babel/*",
    "vite",
    "esbuild",
  ],
  packages: "external",
  banner: {
    js: `
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
`,
  },
});

console.log("✓ Server built successfully");
