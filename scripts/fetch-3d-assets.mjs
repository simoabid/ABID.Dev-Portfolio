#!/usr/bin/env node
/**
 * Vendors the generated 3D assets into `public/`.
 *
 * Binary assets are intentionally kept out of git. Run this once if you would
 * rather self-host them than stream from the generation CDN, then set
 * `NEXT_PUBLIC_USE_REMOTE_3D=false`.
 *
 *   npm run fetch:3d
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(here, '..', 'public');

const CDN_USER = 'user_3GyMraYTybXA3U3ke2AElMIN7ia';
const MESH_CDN = 'https://d3u0tzju9qaucj.cloudfront.net';
const MEDIA_CDN = `https://d8j0ntlcm91z4.cloudfront.net/${CDN_USER}`;

const assets = [
  {
    label: 'hero mesh',
    url:
      process.env.HERO_CORE_URL ??
      `${MESH_CDN}/7d051b5a-7bfe-49fe-a484-24e7b3a9458a/8e63a5ff-5271-4d9a-a944-4b6604a81750.glb`,
    target: resolve(publicDir, 'models', 'hero-core.glb'),
  },
  {
    label: 'environment map',
    url:
      process.env.ENVIRONMENT_MAP_URL ??
      `${MEDIA_CDN}/hf_20260725_005520_1d1a29cf-2c10-4bd1-9b5c-ee7a32a6afca.png`,
    target: resolve(publicDir, 'hdri', 'studio-void.png'),
  },
  {
    label: 'surface texture',
    url:
      process.env.SURFACE_TEXTURE_URL ??
      `${MEDIA_CDN}/hf_20260725_011828_26529d44-8777-4dbf-aed8-361c567277f0.png`,
    target: resolve(publicDir, 'textures', 'surface-basecolor.png'),
  },
  {
    label: 'ambient video loop',
    url:
      process.env.BACKDROP_VIDEO_URL ??
      `${MEDIA_CDN}/hf_20260725_011811_73a31e88-e339-4de2-9db2-ac5895f3e5ef.mp4`,
    target: resolve(publicDir, 'video', 'ambient-loop.mp4'),
  },
];

async function download({ label, url, target }) {
  process.stdout.write(`Fetching ${label}\u2026 `);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`${label} failed: ${response.status} ${response.statusText}`);
  }

  const bytes = Buffer.from(await response.arrayBuffer());
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, bytes);

  const mb = (bytes.byteLength / 1024 / 1024).toFixed(2);
  process.stdout.write(`done (${mb} MB)\n`);
}

try {
  for (const asset of assets) {
    await download(asset);
  }
  console.log('\nAll 3D assets vendored into public/.');
  console.log('Set NEXT_PUBLIC_USE_REMOTE_3D=false to serve them locally.');
} catch (error) {
  console.error(`\n${error.message}`);
  process.exitCode = 1;
}
