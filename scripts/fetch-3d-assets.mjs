#!/usr/bin/env node
/**
 * Vendors the generated 3D assets into `public/`.
 *
 * The generation CDN is not durable storage — treat those URLs as temporary.
 * Run this once to pull everything local, then set
 * `NEXT_PUBLIC_USE_REMOTE_3D=false` so the site stops depending on the CDN:
 *
 *   npm run fetch:3d
 *
 * The downloaded files are binary and are NOT committed by this script. Once
 * they are on disk you should commit them yourself if you want them preserved
 * in git history rather than only on your machine.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(here, '..');
const publicDir = resolve(projectRoot, 'public');

const CDN_USER = 'user_3GyMraYTybXA3U3ke2AElMIN7ia';
const MESH_CDN = 'https://d3u0tzju9qaucj.cloudfront.net';
const MEDIA_HOST = 'https://d8j0ntlcm91z4.cloudfront.net';
const MEDIA_CDN = MEDIA_HOST + '/' + CDN_USER;

const assets = [
  {
    label: 'hero mesh',
    url:
      process.env.HERO_CORE_URL ??
      MESH_CDN +
        '/7d051b5a-7bfe-49fe-a484-24e7b3a9458a' +
        '/8e63a5ff-5271-4d9a-a944-4b6604a81750.glb',
    target: resolve(publicDir, 'models', 'hero-core.glb'),
  },
  {
    label: 'environment map',
    url:
      process.env.ENVIRONMENT_MAP_URL ??
      MEDIA_CDN + '/hf_20260725_005520_1d1a29cf-2c10-4bd1-9b5c-ee7a32a6afca.png',
    target: resolve(publicDir, 'hdri', 'studio-void.png'),
  },
  {
    label: 'surface texture',
    url:
      process.env.SURFACE_TEXTURE_URL ??
      MEDIA_CDN + '/hf_20260725_011828_26529d44-8777-4dbf-aed8-361c567277f0.png',
    target: resolve(publicDir, 'textures', 'surface-basecolor.png'),
  },
  {
    label: 'ambient video loop',
    url:
      process.env.BACKDROP_VIDEO_URL ??
      MEDIA_CDN + '/hf_20260725_011811_73a31e88-e339-4de2-9db2-ac5895f3e5ef.mp4',
    target: resolve(publicDir, 'video', 'ambient-loop.mp4'),
  },
  // Generated but not currently referenced by the scene. Archived locally so
  // the source material survives the CDN.
  {
    label: 'alternate surface texture (unused)',
    url:
      process.env.SURFACE_TEXTURE_ALT_URL ??
      MEDIA_CDN + '/hf_20260725_011828_1583b19e-2993-4447-bde2-2a83636ee824.png',
    target: resolve(publicDir, 'textures', 'surface-basecolor-alt.png'),
  },
  {
    label: 'hero concept art (unused)',
    url:
      process.env.HERO_CONCEPT_URL ??
      MEDIA_CDN + '/hf_20260725_005413_eccf1511-cbc9-4581-9df6-4e8ed738f744.png',
    target: resolve(publicDir, 'images', 'generated', 'hero-concept.png'),
  },
];

async function download({ label, url, target }) {
  process.stdout.write(`Fetching ${label}\u2026 `);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `${label} failed: ${response.status} ${response.statusText}\n  ${url}`
    );
  }

  const bytes = Buffer.from(await response.arrayBuffer());

  if (bytes.byteLength === 0) {
    throw new Error(`${label} failed: server returned an empty body\n  ${url}`);
  }

  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, bytes);

  const mb = (bytes.byteLength / 1024 / 1024).toFixed(2);
  process.stdout.write(`done (${mb} MB)\n`);

  return bytes.byteLength;
}

const failures = [];
let totalBytes = 0;

for (const asset of assets) {
  try {
    totalBytes += await download(asset);
  } catch (error) {
    process.stdout.write('FAILED\n');
    failures.push(error.message);
  }
}

console.log('');

if (failures.length > 0) {
  for (const message of failures) {
    console.error(message);
  }
  console.error(
    `\n${failures.length} of ${assets.length} assets could not be downloaded.`
  );
  process.exitCode = 1;
} else {
  const mb = (totalBytes / 1024 / 1024).toFixed(2);
  console.log(
    `All ${assets.length} assets vendored into ${relative(process.cwd(), publicDir)}/ (${mb} MB).`
  );
  console.log('Set NEXT_PUBLIC_USE_REMOTE_3D=false to serve them locally.');
  console.log('Commit them if you want them preserved in git.');
}
