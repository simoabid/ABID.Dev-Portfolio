#!/usr/bin/env node

/**
 * Downloads the generated 3D assets into `public/` so the site can serve them
 * from its own origin instead of the generation CDN.
 *
 * Usage: npm run fetch:3d
 */

import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(here, '..', 'public');

const HERO_CORE_URL =
  'https://d3u0tzju9qaucj.cloudfront.net/7d051b5a-7bfe-49fe-a484-24e7b3a9458a/8e63a5ff-5271-4d9a-a944-4b6604a81750.glb';

const ENVIRONMENT_MAP_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_3GyMraYTybXA3U3ke2AElMIN7ia/hf_20260725_005520_1d1a29cf-2c10-4bd1-9b5c-ee7a32a6afca.png';

const assets = [
  {
    name: 'hero core mesh',
    url: process.env.HERO_CORE_URL ?? HERO_CORE_URL,
    target: 'models/hero-core.glb',
  },
  {
    name: 'environment map',
    url: process.env.ENVIRONMENT_MAP_URL ?? ENVIRONMENT_MAP_URL,
    target: 'hdri/studio-void.png',
  },
];

async function download({ name, url, target }) {
  const destination = resolve(publicDir, target);
  await mkdir(dirname(destination), { recursive: true });

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Failed to download ${name} (${response.status} ${response.statusText})`
    );
  }

  const bytes = Buffer.from(await response.arrayBuffer());
  await writeFile(destination, bytes);

  const kilobytes = Math.round(bytes.byteLength / 1024);
  process.stdout.write(`Saved ${name} to public/${target} (${kilobytes} KB)\n`);
}

async function main() {
  for (const asset of assets) {
    await download(asset);
  }
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});
