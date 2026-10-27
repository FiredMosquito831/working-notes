import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CLI = path.join(ROOT, 'cli', 'working-notes.mjs');

function run(args, options = {}) {
  const result = spawnSync(process.execPath, [CLI, ...args], {
    encoding: 'utf8',
    cwd: options.cwd || ROOT,
    env: { ...process.env, NO_COLOR: '1' },
  });
  const json = () => {
    try {
      return JSON.parse(result.stdout);
    } catch {
      return null;
    }
  };
  return { ...result, json: json() };
}

function tempDir(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'working-notes-test-'));
  t.after(() => {
    try {
      fs.rmSync(dir, { recursive: true, force: true });
    } catch {
      // Windows can hold a handle briefly; the OS cleans the temp directory.
    }
  });
  return dir;
}

test('installs the skill and its templates', (t) => {
  const dir = tempDir(t);
  const result = run(['install', '--dir', dir, '--json']);
  assert.equal(result.status, 0, `${result.stderr}\n${result.stdout}`);

  const skill = path.join(dir, 'working-notes');
  assert.ok(fs.existsSync(path.join(skill, 'SKILL.md')), 'SKILL.md must exist');
  assert.ok(fs.existsSync(path.join(skill, 'LICENSE')), 'LICENSE must exist');
  for (const name of fs.readdirSync(path.join(ROOT, 'templates'))) {
    assert.ok(fs.existsSync(path.join(skill, 'templates', name)), `${name} must be copied`);
  }

  const manifest = JSON.parse(fs.readFileSync(path.join(skill, '.working-notes.json'), 'utf8'));
  assert.equal(manifest.name, 'working-notes');
  assert.equal(manifest.version, JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8')).version);
});

test('reinstalling reports up-to-date', (t) => {
  const dir = tempDir(t);
  assert.equal(run(['install', '--dir', dir, '--json']).status, 0);
  const again = run(['install', '--dir', dir, '--json']);
  assert.equal(again.status, 0);
  assert.equal(again.json.results[0].status, 'up-to-date');
});

test('doctor verifies an installed copy', (t) => {
  const dir = tempDir(t);
  run(['install', '--dir', dir]);
  const doctor = run(['doctor', '--dir', dir, '--json']);
  assert.equal(doctor.status, 0, doctor.stderr);
  assert.equal(doctor.json.report[0].status, 'ok');
});

test('refuses to replace a directory it did not install', (t) => {
  const dir = tempDir(t);
  fs.mkdirSync(path.join(dir, 'working-notes'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'working-notes', 'mine.txt'), 'keep me');

  const refused = run(['install', '--dir', dir, '--json']);
  assert.equal(refused.status, 1);
  assert.equal(refused.json.results[0].status, 'refused');
  assert.ok(fs.existsSync(path.join(dir, 'working-notes', 'mine.txt')));

  const forced = run(['install', '--dir', dir, '--force', '--json']);
  assert.equal(forced.status, 0, forced.stderr);
  assert.ok(fs.existsSync(path.join(dir, 'working-notes', 'SKILL.md')));
  assert.ok(!fs.existsSync(path.join(dir, 'working-notes', 'mine.txt')));
});

test('uninstall removes only managed copies', (t) => {
  const managed = tempDir(t);
  run(['install', '--dir', managed]);
  const removed = run(['uninstall', '--dir', managed, '--json']);
  assert.equal(removed.status, 0, removed.stderr);
  assert.equal(removed.json.results[0].status, 'removed');
  assert.ok(!fs.existsSync(path.join(managed, 'working-notes')));

  const foreign = tempDir(t);
  fs.mkdirSync(path.join(foreign, 'working-notes'), { recursive: true });
  const refused = run(['uninstall', '--dir', foreign, '--json']);
  assert.equal(refused.status, 1);
  assert.equal(refused.json.results[0].status, 'refused');
  assert.ok(fs.existsSync(path.join(foreign, 'working-notes')));
});

test('project scope uses the documented harness paths', (t) => {
  const project = tempDir(t);
  const result = run(['install', '--agent', 'claude-code', '--scope', 'project', '--cwd', project, '--json']);
  assert.equal(result.status, 0, result.stderr);
  assert.ok(fs.existsSync(path.join(project, '.claude', 'skills', 'working-notes', 'SKILL.md')));
});

test('harnesses that share a directory are installed once', (t) => {
  const project = tempDir(t);
  const result = run([
    'install', '--agent', 'codex,opencode,deepseek', '--scope', 'project', '--cwd', project, '--json',
  ]);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.json.results.length, 1);
  assert.deepEqual(result.json.results[0].harnesses.sort(), ['codex', 'deepseek', 'opencode']);
  assert.ok(fs.existsSync(path.join(project, '.agents', 'skills', 'working-notes', 'SKILL.md')));
});

test('separate installs into a shared directory accumulate harnesses', (t) => {
  const project = tempDir(t);
  assert.equal(run(['install', '--agent', 'codex', '--scope', 'project', '--cwd', project, '--json']).status, 0);
  assert.equal(run(['install', '--agent', 'deepseek', '--scope', 'project', '--cwd', project, '--json']).status, 0);

  const manifest = JSON.parse(
    fs.readFileSync(path.join(project, '.agents', 'skills', 'working-notes', '.working-notes.json'), 'utf8'),
  );
  assert.deepEqual(manifest.harnesses.sort(), ['codex', 'deepseek']);
});

test('unknown harness names fail with a useful message', () => {
  const result = run(['install', '--agent', 'nope', '--dir', os.tmpdir()]);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Unknown harness "nope"/);
});

test('dry run writes nothing', (t) => {
  const dir = tempDir(t);
  const result = run(['install', '--dir', dir, '--dry-run', '--json']);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.json.results[0].status, 'install');
  assert.deepEqual(fs.readdirSync(dir), []);
});

test('list reports every supported harness and whether it is detected', () => {
  const result = run(['list', '--json']);
  assert.equal(result.status, 0, result.stderr);
  const keys = result.json.map((row) => row.key);
  for (const expected of ['claude-code', 'codex', 'opencode', 'antigravity', 'deepseek', 'commandcode']) {
    assert.ok(keys.includes(expected), `${expected} must be listed`);
  }
  assert.ok(result.json.every((row) => typeof row.detected === 'boolean'));
});
