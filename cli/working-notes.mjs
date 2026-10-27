#!/usr/bin/env node
/**
 * working-notes installer
 *
 * Installs the working-notes Agent Skill into the directories each AI coding
 * harness reads. Zero dependencies, Node 18+.
 *
 * Usage:
 *   working-notes install [--agent auto|all|<list>] [--scope user|project]
 *   working-notes uninstall [--agent ...] [--scope ...]
 *   working-notes list
 *   working-notes doctor [--agent ...] [--scope ...]
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = path.resolve(__dirname, '..');
const PKG = JSON.parse(fs.readFileSync(path.join(PKG_ROOT, 'package.json'), 'utf8'));
const SKILL_NAME = 'working-notes';
const MANIFEST = '.working-notes.json';
const REPO = 'FiredMosquito831/working-notes';
const SOURCE_URL = `https://github.com/${REPO}`;

const c = {
  bold: (s) => (process.stdout.isTTY ? `\u001b[1m${s}\u001b[0m` : s),
  dim: (s) => (process.stdout.isTTY ? `\u001b[2m${s}\u001b[0m` : s),
  green: (s) => (process.stdout.isTTY ? `\u001b[32m${s}\u001b[0m` : s),
  yellow: (s) => (process.stdout.isTTY ? `\u001b[33m${s}\u001b[0m` : s),
  red: (s) => (process.stdout.isTTY ? `\u001b[31m${s}\u001b[0m` : s),
  cyan: (s) => (process.stdout.isTTY ? `\u001b[36m${s}\u001b[0m` : s),
};

/**
 * Verified harness directories (October 2026). Every entry cites the location
 * its harness documents for Agent Skills. `user` paths are relative to the home
 * directory; `project` paths are relative to the project root.
 */
const HARNESSES = {
  'claude-code': {
    label: 'Claude Code',
    user: '.claude/skills',
    project: '.claude/skills',
    bins: ['claude'],
    detect: ['.claude'],
    invoke: '/working-notes',
    docs: 'https://code.claude.com/docs/en/skills',
  },
  codex: {
    label: 'OpenAI Codex',
    user: '.agents/skills',
    project: '.agents/skills',
    bins: ['codex'],
    detect: ['.codex', '.agents'],
    invoke: '/skills, or $ to mention',
    docs: 'https://learn.chatgpt.com/docs/build-skills',
  },
  opencode: {
    label: 'OpenCode',
    user: '.agents/skills',
    project: '.agents/skills',
    bins: ['opencode'],
    detect: ['.config/opencode', '.agents'],
    invoke: 'skill tool (working-notes)',
    docs: 'https://opencode.ai/docs/skills/',
  },
  antigravity: {
    label: 'Google Antigravity',
    user: '.gemini/config/skills',
    project: '.agents/skills',
    bins: ['antigravity'],
    detect: ['.gemini/config', '.gemini/antigravity'],
    invoke: '/working-notes',
    docs: 'https://antigravity.google/docs/skills',
  },
  'antigravity-cli': {
    label: 'Antigravity CLI (agy)',
    user: '.gemini/antigravity-cli/skills',
    project: '.agents/skills',
    bins: ['agy'],
    detect: ['.gemini/antigravity-cli'],
    invoke: '/working-notes',
    docs: 'https://antigravity.google/docs/skills',
  },
  deepseek: {
    label: 'DeepSeek Harness (dsh)',
    user: '.agents/skills',
    project: '.agents/skills',
    bins: ['dsh'],
    detect: ['.dsh', '.agents'],
    invoke: 'skills catalog',
    docs: 'https://github.com/deepseek-ai/deepseek-harness',
  },
  kilo: {
    label: 'Kilo Code',
    user: '.kilo/skills',
    project: '.kilo/skills',
    bins: ['kilo'],
    detect: ['.kilo'],
    invoke: '/working-notes',
    docs: 'https://kilo.ai/docs/customize/skills',
  },
  commandcode: {
    label: 'Command Code',
    user: null,
    project: '.commandcode/skills',
    bins: ['commandcode', 'command-code', 'cmdc'],
    detect: ['.commandcode'],
    invoke: 'automatic',
    docs: 'https://github.com/CommandCodeAI/agent-skills',
  },
};

const SKILL_FILES = ['SKILL.md', 'LICENSE'];
const SKILL_DIRS = ['templates'];

if (process.platform === 'win32' && !process.env.NO_COLOR) {
  // Windows terminals that support ANSI keep the colors; others ignore them.
}

function parseArgs(argv) {
  const opts = {
    command: 'install',
    agents: null,
    scope: 'user',
    dirs: [],
    cwd: process.cwd(),
    force: false,
    dryRun: false,
    json: false,
    quiet: false,
    help: false,
  };
  const commands = new Set(['install', 'uninstall', 'list', 'doctor', 'help', 'version']);
  let i = 0;
  if (argv[0] && !argv[0].startsWith('-') && commands.has(argv[0])) {
    opts.command = argv[0];
    i = 1;
  }
  for (; i < argv.length; i += 1) {
    const arg = argv[i];
    const [flag, inline] = arg.includes('=') ? [arg.slice(0, arg.indexOf('=')), arg.slice(arg.indexOf('=') + 1)] : [arg, null];
    const value = () => {
      const v = inline ?? argv[++i];
      if (v === undefined) die(`Missing value for ${flag}`);
      return v;
    };
    switch (flag) {
      case '--agent':
      case '-a':
        opts.agents = value().split(',').map((s) => s.trim()).filter(Boolean);
        break;
      case '--scope':
      case '-s':
        opts.scope = value();
        break;
      case '--dir':
      case '-d':
        opts.dirs.push(...value().split(',').map((s) => s.trim()).filter(Boolean));
        break;
      case '--cwd':
        opts.cwd = path.resolve(value());
        break;
      case '--force':
      case '-f':
        opts.force = true;
        break;
      case '--dry-run':
        opts.dryRun = true;
        break;
      case '--json':
        opts.json = true;
        break;
      case '--quiet':
      case '-q':
        opts.quiet = true;
        break;
      case '--help':
      case '-h':
        opts.help = true;
        break;
      case '--version':
      case '-v':
        opts.command = 'version';
        break;
      default:
        die(`Unknown option: ${arg}\nRun "working-notes help" for usage.`);
    }
  }
  return opts;
}

function die(message) {
  process.stderr.write(`${c.red('error:')} ${message}\n`);
  process.exit(1);
}

function expandHome(p) {
  if (p === '~') return os.homedir();
  if (p.startsWith('~/') || p.startsWith('~\\')) return path.join(os.homedir(), p.slice(2));
  return p;
}

function hasBinary(name) {
  const exts = process.platform === 'win32'
    ? (process.env.PATHEXT || '.COM;.EXE;.BAT;.CMD').split(';').filter(Boolean)
    : [''];
  const dirs = (process.env.PATH || '').split(path.delimiter).filter(Boolean);
  for (const dir of dirs) {
    for (const ext of exts) {
      for (const form of new Set([ext, ext.toLowerCase(), ext.toUpperCase()])) {
        try {
          if (fs.existsSync(path.join(dir, name + form))) return true;
        } catch { /* unreadable PATH entry */ }
      }
    }
  }
  return false;
}

function detectHarness(key) {
  const h = HARNESSES[key];
  if (h.bins.some(hasBinary)) return true;
  return h.detect.some((rel) => fs.existsSync(path.join(os.homedir(), rel)));
}

function normalizeAgentList(raw) {
  if (raw === null) return 'auto';
  if (raw.length === 1 && (raw[0] === 'all' || raw[0] === 'auto')) return raw[0];
  const out = [];
  for (const name of raw) {
    if (!HARNESSES[name]) {
      die(`Unknown harness "${name}". Known: ${Object.keys(HARNESSES).join(', ')}, all, auto.`);
    }
    out.push(name);
  }
  return [...new Set(out)];
}

function resolveTargets(opts) {
  const scope = opts.scope;
  if (!['user', 'project'].includes(scope)) die(`--scope must be "user" or "project", got "${scope}"`);

  // Validate names even when --dir bypasses the harness map.
  if (opts.agents) normalizeAgentList(opts.agents);

  if (opts.dirs.length) {
    return {
      targets: opts.dirs.map((dir) => ({
        dir: path.resolve(opts.cwd, expandHome(dir)),
        harnesses: ['custom'],
        labels: ['Custom directory'],
      })),
      skipped: [],
    };
  }

  const selection = normalizeAgentList(opts.agents);
  let keys;
  if (selection === 'all') keys = Object.keys(HARNESSES);
  else if (selection === 'auto') keys = Object.keys(HARNESSES).filter(detectHarness);
  else keys = selection;

  if (selection === 'auto' && keys.length === 0) {
    die(
      'No known harness detected. Install explicitly, for example:\n' +
      '  working-notes install --agent claude-code\n' +
      `Known: ${Object.keys(HARNESSES).join(', ')} — or use --dir <path>.`,
    );
  }

  const byPath = new Map();
  const skipped = [];
  for (const key of keys) {
    const h = HARNESSES[key];
    const rel = scope === 'user' ? h.user : h.project;
    if (!rel) {
      skipped.push({ harness: key, reason: `${h.label} documents a project-level skills directory only` });
      continue;
    }
    const dir = scope === 'user' ? path.join(os.homedir(), rel) : path.resolve(opts.cwd, rel);
    const existing = byPath.get(dir) || { dir, harnesses: [], labels: [] };
    existing.harnesses.push(key);
    existing.labels.push(h.label);
    byPath.set(dir, existing);
  }
  return { targets: [...byPath.values()], skipped };
}

function readManifest(dir) {
  try {
    return JSON.parse(fs.readFileSync(path.join(dir, MANIFEST), 'utf8'));
  } catch {
    return null;
  }
}

const TRANSIENT = new Set(['EPERM', 'EBUSY', 'EACCES', 'ENOTEMPTY']);

/** Windows file scanners briefly hold handles on newly written directories. */
function retrySync(fn, attempts = 12, baseDelay = 25) {
  let last;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      return fn();
    } catch (error) {
      last = error;
      if (!TRANSIENT.has(error.code)) throw error;
      const ms = baseDelay * (attempt + 1);
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
    }
  }
  throw last;
}

function fileHashes(srcDir) {
  const out = {};
  const walk = (rel) => {
    const abs = path.join(srcDir, rel);
    const stat = fs.lstatSync(abs);
    if (stat.isDirectory()) {
      for (const entry of fs.readdirSync(abs).sort()) walk(path.join(rel, entry));
    } else if (stat.isFile()) {
      out[rel.split(path.sep).join('/')] = fs.readFileSync(abs);
    }
  };
  for (const file of SKILL_FILES) {
    if (fs.existsSync(path.join(srcDir, file))) walk(file);
  }
  for (const dir of SKILL_DIRS) {
    if (fs.existsSync(path.join(srcDir, dir))) walk(dir);
  }
  return out;
}

function sameContents(a, b) {
  const ha = fileHashes(a);
  const hb = fileHashes(b);
  const ka = Object.keys(ha).sort();
  const kb = Object.keys(hb).sort();
  if (ka.length !== kb.length) return false;
  return ka.every((key, i) => key === kb[i] && ha[key].equals(hb[key]));
}

function copySkill(destDir) {
  const target = path.join(destDir, SKILL_NAME);
  if (fs.existsSync(target) && !fs.lstatSync(target).isDirectory()) {
    die(`${target} exists and is not a directory. Move it away and retry.`);
  }
  fs.mkdirSync(destDir, { recursive: true });
  const tmp = path.join(destDir, `.${SKILL_NAME}.tmp-${process.pid}`);

  const cleanup = () => { try { fs.rmSync(tmp, { recursive: true, force: true }); } catch { /* best effort */ } };
  try {
    cleanup();
    fs.mkdirSync(tmp, { recursive: true });
    for (const file of SKILL_FILES) {
      const src = path.join(PKG_ROOT, file);
      if (fs.existsSync(src)) fs.copyFileSync(src, path.join(tmp, file));
    }
    for (const dir of SKILL_DIRS) {
      const src = path.join(PKG_ROOT, dir);
      if (fs.existsSync(src)) fs.cpSync(src, path.join(tmp, dir), { recursive: true });
    }
    fs.writeFileSync(
      path.join(tmp, MANIFEST),
      `${JSON.stringify({
        name: SKILL_NAME,
        version: PKG.version,
        source: SOURCE_URL,
        installedAt: new Date().toISOString(),
        harnesses: [],
      }, null, 2)}\n`,
    );
    if (fs.existsSync(target)) retrySync(() => fs.rmSync(target, { recursive: true, force: true }));
    retrySync(() => fs.renameSync(tmp, target));
  } catch (error) {
    cleanup();
    throw error;
  }
}

function install(opts) {
  const { targets, skipped = [] } = resolveTargets(opts);
  if (!targets.length) die('Nothing to install: every selected harness was skipped.');

  const results = [];
  for (const t of targets) {
    const dest = path.join(t.dir, SKILL_NAME);
    const existing = readManifest(dest);
    let action = 'install';
    if (fs.existsSync(dest)) {
      if (!existing && !opts.force) {
        results.push({ status: 'refused', ...t, dest, reason: 'directory exists and was not installed by working-notes (use --force to replace)' });
        continue;
      }
      if (existing && sameContents(PKG_ROOT, dest) && existing.version === PKG.version) {
        action = 'up-to-date';
      } else {
        action = existing ? 'update' : 'replace';
      }
    }
    if (!opts.dryRun) {
      try {
        copySkill(t.dir);
        const manifest = readManifest(dest);
        if (manifest) {
          manifest.harnesses = [...new Set([...(existing?.harnesses || []), ...t.harnesses])];
          manifest.version = PKG.version;
          fs.writeFileSync(path.join(dest, MANIFEST), `${JSON.stringify(manifest, null, 2)}\n`);
        }
      } catch (error) {
        results.push({ status: 'error', ...t, dest, reason: error.message });
        continue;
      }
    }
    results.push({ status: action, ...t, dest });
  }

  for (const s of skipped) results.push({ status: 'skipped', harnesses: [s.harness], labels: [HARNESSES[s.harness].label], reason: s.reason });

  if (opts.json) {
    process.stdout.write(`${JSON.stringify({ version: PKG.version, results }, null, 2)}\n`);
  } else if (!opts.quiet) {
    printResults(results, opts);
  }
  if (results.some((r) => r.status === 'error' || r.status === 'refused')) process.exitCode = 1;
}

function printResults(results, opts) {
  if (!results.length) {
    process.stdout.write(`${c.dim('Nothing to do.')}\n`);
    return;
  }
  const width = Math.max(...results.map((r) => (r.labels || []).join(', ').length), 8);
  for (const r of results) {
    const who = (r.labels || []).join(', ').padEnd(width);
    const verb = r.status.padEnd(11);
    const tone = {
      install: c.green,
      update: c.cyan,
      replace: c.cyan,
      'up-to-date': c.green,
      removed: c.green,
      absent: c.dim,
      skipped: c.yellow,
      refused: c.red,
      error: c.red,
    }[r.status] || ((s) => s);
    const target = r.dest ? c.dim(r.dest) : '';
    const reason = r.reason ? c.dim(` (${r.reason})`) : '';
    process.stdout.write(`  ${who}  ${tone(verb)}  ${target}${reason}\n`);
  }
  if (opts.command === 'install') {
    if (!opts.dryRun) {
      process.stdout.write(`\n${c.bold('working-notes')} ${PKG.version} is in place. Start a session in your project and run ${c.cyan('/working-notes init')} (or just ask: "set up working notes").\n`);
    } else {
      process.stdout.write(`\n${c.dim('Dry run: nothing was written.')}\n`);
    }
  }
}

function uninstall(opts) {
  const { targets } = resolveTargets(opts);
  const results = [];
  for (const t of targets) {
    const dest = path.join(t.dir, SKILL_NAME);
    if (!fs.existsSync(dest)) {
      results.push({ status: 'absent', ...t, dest });
      continue;
    }
    const manifest = readManifest(dest);
    if (!manifest && !opts.force) {
      results.push({ status: 'refused', ...t, dest, reason: 'not installed by working-notes (use --force)' });
      continue;
    }
    if (!opts.dryRun) retrySync(() => fs.rmSync(dest, { recursive: true, force: true }));
    results.push({ status: 'removed', ...t, dest });
  }
  if (opts.json) process.stdout.write(`${JSON.stringify({ results }, null, 2)}\n`);
  else if (!opts.quiet) printResults(results, opts);
  if (results.some((r) => r.status === 'refused' || r.status === 'error')) process.exitCode = 1;
}

function list(opts) {
  const rows = Object.entries(HARNESSES).map(([key, h]) => ({
    key,
    label: h.label,
    user: h.user ? path.join(os.homedir(), h.user) : '— (project only)',
    project: h.project,
    detected: detectHarness(key),
    invoke: h.invoke,
  }));
  if (opts.json) {
    process.stdout.write(`${JSON.stringify(rows, null, 2)}\n`);
    return;
  }
  const keyW = Math.max(...rows.map((r) => r.key.length), 4);
  const labelW = Math.max(...rows.map((r) => r.label.length), 8);
  process.stdout.write(`${c.bold('Harnesses')}\n\n`);
  process.stdout.write(`  ${'AGENT'.padEnd(keyW)}  ${'HARNESS'.padEnd(labelW)}  DETECTED  USER SCOPE\n`);
  for (const r of rows) {
    const detected = (r.detected ? 'yes' : 'no').padEnd(8);
    const colored = r.detected ? c.green(detected) : c.dim(detected);
    process.stdout.write(`  ${r.key.padEnd(keyW)}  ${r.label.padEnd(labelW)}  ${colored}  ${r.user}\n`);
  }
  process.stdout.write(`\n${c.dim('Project scope writes to <project>/<path>; see "working-notes help".')}\n`);
}

function doctor(opts) {
  const { targets } = resolveTargets(opts);
  const report = [];
  for (const t of targets) {
    const dest = path.join(t.dir, SKILL_NAME);
    if (!fs.existsSync(dest)) {
      report.push({ ...t, dest, status: 'missing' });
      continue;
    }
    const manifest = readManifest(dest);
    if (!manifest) {
      report.push({ ...t, dest, status: 'unmanaged' });
      continue;
    }
    const current = sameContents(PKG_ROOT, dest);
    report.push({
      ...t,
      dest,
      status: current && manifest.version === PKG.version ? 'ok' : 'stale',
      installedVersion: manifest.version,
      expectedVersion: PKG.version,
    });
  }
  if (opts.json) {
    process.stdout.write(`${JSON.stringify({ version: PKG.version, report }, null, 2)}\n`);
    return;
  }
  for (const r of report) {
    const tone = { ok: c.green, stale: c.yellow, missing: c.dim, unmanaged: c.dim }[r.status] || ((s) => s);
    const extra = r.status === 'stale' ? c.dim(` installed ${r.installedVersion}, expected ${r.expectedVersion}`) : '';
    process.stdout.write(`  ${(r.labels || []).join(', ')}: ${tone(r.status)}${extra} ${c.dim(r.dest)}\n`);
  }
  process.stdout.write(`\n${c.dim(`working-notes ${PKG.version}`)}\n`);
  if (report.some((r) => r.status === 'stale')) process.exitCode = 1;
}

function help() {
  process.stdout.write(`working-notes ${PKG.version} — a portable Agent Skill for AI coding harnesses

${c.bold('USAGE')}
  working-notes [command] [options]

${c.bold('COMMANDS')}
  install       Install the skill (default command)
  uninstall     Remove a copy installed by this tool
  list          Show supported harnesses, paths and detection
  doctor        Check installed copies against this version
  help          Show this help
  version       Print the version

${c.bold('OPTIONS')}
  -a, --agent <list>    auto (detected, default), all, or comma-separated:
                        ${Object.keys(HARNESSES).join(', ')}
  -s, --scope <scope>   user (default) or project
  -d, --dir <path>      Explicit skills directory (repeatable). Bypasses --agent.
      --cwd <path>      Project root for --scope project (default: cwd)
  -f, --force           Replace a directory this tool did not install
      --dry-run         Print the plan, write nothing
      --json            Machine-readable output
  -q, --quiet           Only errors
  -h, --help            This help
  -v, --version         Print the version

${c.bold('EXAMPLES')}
  working-notes install                      # every harness detected on this machine
  working-notes install --agent all          # every supported harness
  working-notes install -a claude-code,codex # two harnesses, user scope
  working-notes install -a antigravity --scope project
  working-notes install --dir ./.agents/skills
  working-notes doctor --json
  working-notes uninstall -a claude-code

${c.bold('WHERE IT GOES')}
  The skill is copied as <skills dir>/${SKILL_NAME}/ (SKILL.md + templates/).
  Harness-specific paths: ${SOURCE_URL}#install

${c.bold('THEN')}
  In your project session, run /working-notes init (or ask "set up working notes").
`);
}

const opts = parseArgs(process.argv.slice(2));
if (opts.help || opts.command === 'help') {
  help();
} else if (opts.command === 'version') {
  process.stdout.write(`${PKG.version}\n`);
} else if (opts.command === 'install') {
  install(opts);
} else if (opts.command === 'uninstall') {
  uninstall(opts);
} else if (opts.command === 'list') {
  list(opts);
} else if (opts.command === 'doctor') {
  doctor(opts);
} else {
  help();
  process.exitCode = 1;
}
