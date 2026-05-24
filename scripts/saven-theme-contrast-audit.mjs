#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const files = [
  'src/pages/Saven.tsx',
  ...fs.readdirSync(path.join(root, 'src/features/saven/pages'))
    .filter((name) => name.endsWith('.tsx'))
    .map((name) => 'src/features/saven/pages/' + name),
];

const riskyRules = [
  {
    name: 'white text on white surface',
    pattern: /bg-white(?:\\/\\d+)?[^\n]*text-white(?![^\n]*dark:)/,
  },
  {
    name: 'white text on pale SAVEN surface',
    pattern: /bg-\\[#(?:f7f5f1|fbfaf7|f8fafc)\\][^\n]*text-white(?![^\n]*dark:)/,
  },
  {
    name: 'white text on pale semantic surface',
    pattern: /bg-(?:blue|emerald|amber|red|slate)-(?:50|100)[^\n]*text-white(?![^\n]*dark:)/,
  },
  {
    name: 'very light text without explicit dark surface',
    pattern: /text-(?:slate|blue|emerald|amber)-(?:100|200)(?![^\n]*(?:bg-slate-950|bg-\\[#020817\\]|bg-\\[#07111f\\]|bg-white\\/\\[0|dark:))/,
  },
];

const issues = [];
for (const relativePath of files) {
  const absolutePath = path.join(root, relativePath);
  const source = fs.readFileSync(absolutePath, 'utf8');
  const lines = source.split(/\r?\n/);
  lines.forEach((line, index) => {
    for (const rule of riskyRules) {
      if (rule.pattern.test(line)) {
        issues.push({ file: relativePath, line: index + 1, rule: rule.name, text: line.trim().slice(0, 180) });
      }
    }
  });
}

if (issues.length) {
  console.error('SAVEN theme contrast audit failed.');
  for (const issue of issues) {
    console.error('- ' + issue.file + ':' + issue.line + ' [' + issue.rule + '] ' + issue.text);
  }
  process.exit(1);
}

console.log('SAVEN theme contrast audit passed.');
