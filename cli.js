#!/usr/bin/env node
import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { existsSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const srcPath = join(__dirname, "src/cli/index.ts");
const distPath = join(__dirname, "dist/src/cli/index.js");

if (existsSync(srcPath)) {
  // Development: run TypeScript directly via tsx
  spawn("npx", ["tsx", srcPath, ...process.argv.slice(2)], {
    stdio: "inherit",
    shell: true,
    cwd: __dirname,
  });
} else {
  // Production: import compiled JavaScript
  import(distPath);
}
