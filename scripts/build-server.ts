import { build } from "esbuild";
import { rmSync } from "fs";

// Clean dist directory
rmSync("dist", { recursive: true, force: true });

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
  ],
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
