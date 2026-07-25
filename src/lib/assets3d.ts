/**
 * Generated 3D asset manifest.
 *
 * Every asset here was generated specifically for this site rather than pulled
 * from a stock library. Binary files are not committed to the repository, so
 * they stream from the generation CDN by default. Running `npm run fetch:3d`
 * vendors them into `public/` and flipping `NEXT_PUBLIC_USE_REMOTE_3D` to
 * `'false'` serves them from the same origin instead.
 */
export interface Asset3dManifest {
  /** Signature hero mesh — textured PBR GLB. */
  heroCore: string;
  /** Equirectangular environment map used for image based lighting. */
  environment: string;
  /** Tileable PBR base colour used by the backdrop surface. */
  surfaceTexture: string;
  /** Looping ambient video rendered behind the WebGL layer. */
  backdropVideo: string;
}

const CDN_USER = 'user_3GyMraYTybXA3U3ke2AElMIN7ia';
const MESH_CDN = 'https://d3u0tzju9qaucj.cloudfront.net';
const MEDIA_HOST = 'https://d8j0ntlcm91z4.cloudfront.net';
const MEDIA_CDN = MEDIA_HOST + '/' + CDN_USER;

export const LOCAL_ASSETS_3D: Asset3dManifest = {
  heroCore: '/models/hero-core.glb',
  environment: '/hdri/studio-void.png',
  surfaceTexture: '/textures/surface-basecolor.png',
  backdropVideo: '/video/ambient-loop.mp4',
};

export const REMOTE_ASSETS_3D: Asset3dManifest = {
  heroCore:
    MESH_CDN +
    '/7d051b5a-7bfe-49fe-a484-24e7b3a9458a' +
    '/8e63a5ff-5271-4d9a-a944-4b6604a81750.glb',
  environment:
    MEDIA_CDN + '/hf_20260725_005520_1d1a29cf-2c10-4bd1-9b5c-ee7a32a6afca.png',
  surfaceTexture:
    MEDIA_CDN + '/hf_20260725_011828_26529d44-8777-4dbf-aed8-361c567277f0.png',
  backdropVideo:
    MEDIA_CDN + '/hf_20260725_011811_73a31e88-e339-4de2-9db2-ac5895f3e5ef.mp4',
};

const useRemote = process.env.NEXT_PUBLIC_USE_REMOTE_3D !== 'false';
const base = useRemote ? REMOTE_ASSETS_3D : LOCAL_ASSETS_3D;

export const ASSETS_3D: Asset3dManifest = {
  heroCore: process.env.NEXT_PUBLIC_HERO_CORE_URL ?? base.heroCore,
  environment: process.env.NEXT_PUBLIC_ENVIRONMENT_MAP_URL ?? base.environment,
  surfaceTexture:
    process.env.NEXT_PUBLIC_SURFACE_TEXTURE_URL ?? base.surfaceTexture,
  backdropVideo:
    process.env.NEXT_PUBLIC_BACKDROP_VIDEO_URL ?? base.backdropVideo,
};
