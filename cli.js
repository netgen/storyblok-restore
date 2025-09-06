#!/usr/bin/env node
import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const cliPath = join(__dirname, "src/cli/index.ts");

spawn("npx", ["tsx", cliPath, ...process.argv.slice(2)], {
  stdio: "inherit",
  shell: true,
});
