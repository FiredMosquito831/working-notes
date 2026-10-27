#!/usr/bin/env node
/**
 * Cross-platform test entry point.
 *
 * Node 20 does not expand globs itself, and PowerShell/cmd do not expand them
 * for `npm test`. Resolve the files here and pass explicit paths.
 */

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TEST_DIR = path.join(ROOT, 'tests');

const files = fs.readdirSync(TEST_DIR)
  .filter((name) => name.endsWith('.test.mjs'))
  .sort()
  .map((name) => path.join(TEST_DIR, name));

if (files.length === 0) {
  process.stderr.write('No test files found in tests/\n');
  process.exit(1);
}

const result = spawnSync(process.execPath, ['--test', ...files], {
  cwd: ROOT,
  stdio: 'inherit',
  env: process.env,
});

if (result.error) {
  process.stderr.write(`${result.error.message}\n`);
  process.exit(1);
}
process.exit(result.status ?? 1);
