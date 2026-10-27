#!/usr/bin/env node
/**
 * Repository checks that run in CI and before a release.
 * No dependencies; exits 1 on the first failed group.
 */

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];
const checks = [];

function check(name, fn) {
  try {
    fn();
    checks.push({ name, ok: true });
  } catch (error) {
    checks.push({ name, ok: false, error: error.message });
    failures.push(`${name}: ${error.message}`);
  }
}

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}

function json(rel) {
  return JSON.parse(read(rel));
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

check('SKILL.md has Agent Skills frontmatter', () => {
  const text = read('SKILL.md');
  assert(text.startsWith('---\n'), 'SKILL.md must start with a YAML frontmatter block');
  const end = text.indexOf('\n---', 4);
  assert(end > 0, 'frontmatter must be closed');
  const front = text.slice(4, end);
  assert(/^name:\s*working-notes\s*$/m.test(front), 'frontmatter name must be working-notes');
  const description = front.match(/^description:\s*(.+)$/m);
  assert(description && description[1].length > 80, 'description must explain when to use the skill');
});

check('templates are present and non-empty', () => {
  const expected = [
    'BRIEF-IMPLEMENTER.template.md',
    'BRIEF-INVESTIGATOR.template.md',
    'CLAUDE-MD-BLOCK.template.md',
    'HANDOFF.template.md',
    'QUEUE.template.md',
    'SPEC.template.md',
    'VERIFY-RECIPE.md',
    'WORKING-NOTES.template.md',
  ];
  for (const name of expected) {
    const file = path.join(ROOT, 'templates', name);
    assert(fs.existsSync(file), `missing templates/${name}`);
    assert(fs.statSync(file).size > 200, `templates/${name} looks empty`);
  }
});

check('package and plugin manifests agree', () => {
  const pkg = json('package.json');
  const plugin = json('.claude-plugin/plugin.json');
  const market = json('.claude-plugin/marketplace.json');
  assert(pkg.name === 'working-notes-skill', 'package name changed; update docs and tests');
  assert(plugin.name === 'working-notes', 'plugin name must match the skill name');
  assert(plugin.version === pkg.version, 'plugin version must match package version');
  assert(Array.isArray(market.plugins) && market.plugins.length > 0, 'marketplace must list a plugin');
  const entry = market.plugins.find((p) => p.name === 'working-notes');
  assert(entry, 'marketplace must list working-notes');
  assert(entry.source === './' || entry.source === '.', 'the plugin lives at the repository root');
  assert(market.name !== 'claude-plugins-official', 'marketplace name is reserved');
});

check('README covers every supported harness', () => {
  const readme = read('README.md');
  const cli = read('cli/working-notes.mjs');
  const keys = [...cli.matchAll(/^  '?([a-z-]+)'?: \{\n    label:/gm)].map((m) => m[1]);
  assert(keys.length >= 7, 'could not read the harness map from the CLI');
  const installDoc = fs.existsSync(path.join(ROOT, 'docs', 'INSTALL.md')) ? read('docs/INSTALL.md') : '';
  for (const key of keys) {
    assert(readme.includes(key) || installDoc.includes(key), `no install documentation for ${key}`);
  }
  assert(readme.includes('npx -y github:FiredMosquito831/working-notes'), 'README must show the one-line installer');
});

check('the CLI answers', () => {
  for (const args of [['--version'], ['--help'], ['list', '--json']]) {
    execFileSync(process.execPath, [path.join(ROOT, 'cli', 'working-notes.mjs'), ...args], {
      stdio: 'pipe',
      env: { ...process.env, NO_COLOR: '1' },
    });
  }
});

check('no secrets are committed', () => {
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (['.git', 'node_modules', '.playwright-mcp'].includes(entry.name)) continue;
      const abs = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(abs);
      else if (/\.(md|mjs|json|yml|yaml|sh|ps1)$/.test(entry.name)) {
        const text = fs.readFileSync(abs, 'utf8');
        assert(!/gh[opsu]_[A-Za-z0-9]{20,}/.test(text), `possible GitHub token in ${abs}`);
        assert(!/sk-[A-Za-z0-9]{20,}/.test(text), `possible API key in ${abs}`);
      }
    }
  };
  walk(ROOT);
});

for (const c of checks) {
  process.stdout.write(`${c.ok ? 'ok  ' : 'FAIL'}  ${c.name}\n`);
}
if (failures.length) {
  process.stderr.write(`\n${failures.length} check(s) failed:\n`);
  for (const failure of failures) process.stderr.write(`  - ${failure}\n`);
  process.exit(1);
}
process.stdout.write(`\nall ${checks.length} checks passed\n`);
