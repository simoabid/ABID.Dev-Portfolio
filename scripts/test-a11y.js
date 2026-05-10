#!/usr/bin/env node

/**
 * Accessibility Audit Script
 *
 * Runs axe-core against the portfolio routes using Puppeteer.
 * Designed for CI integration — exits with code 1 if critical
 * or serious violations are found.
 *
 * Usage:
 *   node scripts/test-a11y.js [--url http://localhost:3000]
 *
 * Prerequisites:
 *   npm install --save-dev puppeteer axe-core
 *
 * Environment:
 *   A11Y_BASE_URL — override the default localhost URL
 */

const puppeteer = require('puppeteer');
const { AxePuppeteer } = require('@axe-core/puppeteer');

const BASE_URL =
  process.env.A11Y_BASE_URL || process.argv[2] || 'http://localhost:3000';

/** Routes to audit */
const ROUTES = ['/', '/projects'];

/** Impact levels that cause a non-zero exit */
const FAIL_ON = ['critical', 'serious'];

/** ANSI color helpers */
const color = {
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  cyan: (text) => `\x1b[36m${text}\x1b[0m`,
  bold: (text) => `\x1b[1m${text}\x1b[0m`,
  dim: (text) => `\x1b[2m${text}\x1b[0m`,
};

/**
 * Format a single violation for console output.
 * @param {import('axe-core').Result} violation
 * @returns {string}
 */
function formatViolation(violation) {
  const impactColor =
    violation.impact === 'critical'
      ? color.red
      : violation.impact === 'serious'
        ? color.yellow
        : color.dim;

  const header = `  ${impactColor(`[${violation.impact?.toUpperCase()}]`)} ${violation.id}: ${violation.help}`;
  const url = `    ${color.dim(violation.helpUrl)}`;
  const nodes = violation.nodes
    .slice(0, 3)
    .map((node) => `    → ${color.cyan(node.target.join(', '))}`)
    .join('\n');
  const extra =
    violation.nodes.length > 3
      ? `    ${color.dim(`... and ${violation.nodes.length - 3} more`)}`
      : '';

  return [header, url, nodes, extra].filter(Boolean).join('\n');
}

/**
 * Run axe-core audit on a single page.
 * @param {import('puppeteer').Browser} browser
 * @param {string} url
 * @returns {Promise<import('axe-core').AxeResults>}
 */
async function auditPage(browser, url) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    // Wait a moment for client-side hydration & animations
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const results = await new AxePuppeteer(page)
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'])
      .analyze();

    return results;
  } finally {
    await page.close();
  }
}

/**
 * Main entry point.
 */
async function main() {
  console.log(color.bold('\n🔍  Accessibility Audit'));
  console.log(color.dim(`   Base URL: ${BASE_URL}`));
  console.log(color.dim(`   Routes:   ${ROUTES.join(', ')}\n`));

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  } catch (err) {
    console.error(color.red('✖ Failed to launch browser:'), err.message);
    process.exit(2);
  }

  let totalViolations = 0;
  let totalFailures = 0;
  const summary = [];

  for (const route of ROUTES) {
    const url = `${BASE_URL}${route}`;
    console.log(color.bold(`━━━ ${url} ━━━\n`));

    try {
      const results = await auditPage(browser, url);
      const violations = results.violations;
      const failures = violations.filter((v) => FAIL_ON.includes(v.impact));

      totalViolations += violations.length;
      totalFailures += failures.length;

      if (violations.length === 0) {
        console.log(color.green('  ✓ No violations found!\n'));
      } else {
        violations.forEach((v) => {
          console.log(formatViolation(v));
          console.log();
        });
      }

      summary.push({
        route,
        total: violations.length,
        critical: violations.filter((v) => v.impact === 'critical').length,
        serious: violations.filter((v) => v.impact === 'serious').length,
        moderate: violations.filter((v) => v.impact === 'moderate').length,
        minor: violations.filter((v) => v.impact === 'minor').length,
        passes: results.passes.length,
      });
    } catch (err) {
      console.error(color.red(`  ✖ Failed to audit ${url}:`), err.message);
      summary.push({ route, error: err.message });
    }
  }

  await browser.close();

  // ── Summary Table ──
  console.log(color.bold('\n━━━ SUMMARY ━━━\n'));
  console.log(
    '  Route            | Total | Critical | Serious | Moderate | Minor | Passes'
  );
  console.log(
    '  -----------------+-------+----------+---------+----------+-------+-------'
  );

  for (const row of summary) {
    if (row.error) {
      console.log(
        `  ${row.route.padEnd(17)}| ${color.red('ERROR: ' + row.error)}`
      );
      continue;
    }
    const line = [
      `  ${row.route.padEnd(17)}`,
      `| ${String(row.total).padStart(5)} `,
      `| ${String(row.critical).padStart(8)} `,
      `| ${String(row.serious).padStart(7)} `,
      `| ${String(row.moderate).padStart(8)} `,
      `| ${String(row.minor).padStart(5)} `,
      `| ${String(row.passes).padStart(6)}`,
    ].join('');
    console.log(line);
  }

  console.log();

  if (totalFailures > 0) {
    console.log(
      color.red(
        `✖ ${totalFailures} critical/serious violation(s) found. Audit FAILED.\n`
      )
    );
    process.exit(1);
  } else if (totalViolations > 0) {
    console.log(
      color.yellow(
        `⚠ ${totalViolations} non-blocking violation(s) found. Consider fixing.\n`
      )
    );
    process.exit(0);
  } else {
    console.log(color.green('✓ All pages passed accessibility audit!\n'));
    process.exit(0);
  }
}

main().catch((err) => {
  console.error(color.red('Fatal error:'), err);
  process.exit(2);
});
