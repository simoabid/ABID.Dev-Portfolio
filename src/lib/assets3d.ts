/**
 * Locations of the generated 3D assets.
 *
 * The binary assets (GLB mesh, environment panorama) are not committed to the
 * repo to keep clones small. They are served from their generation CDN by
 * default and can be vendored into `public/` by running `npm run fetch:3d`,
 * which is what production builds should do.
 *
 * Set the matching `NEXT_PUBLIC_*` variables to point at your own CDN.
 */

export interface Asset3dManifest {
  /** Signature hero mesh, glTF binary. */
  heroCore: string;
  /** Equirectangular environment map used for image based lighting. */
  environment: string;
}

/** Local paths used once `npm run fetch:3d` has vendored the assets. */
export const LOCAL_ASSETS_3D: Asset3dManifest = {
  heroCore: '/models/hero-core.glb',
  environment: '/hdri/studio-void.png',
};

/** Canonical remote sources, also used by the vendoring script. */
export const REMOTE_ASSETS_3D: Asset3dManifest = {
  heroCore:
    'https://d3u0tzju9qaucj.cloudfront.net/7d051b5a-7bfe-49fe-a484-24e7b3a9458a/8e63a5ff-5271-4d9a-a944-4b6604a81750.glb',
  environment:
    'https://d8j0ntlcm91z4.cloudfront.net/user_3GyMraYTybXA3U3ke2AElMIN7ia/hf_20260725_005520_1d1a29cf-2c10-4bd1-9b5c-ee7a32a6afca.png',
};

function resolve(local: string, remote: string, override?: string): string {
  if (override && override.length > 0) {
    return override;
  }
  return process.env.NEXT_PUBLIC_USE_REMOTE_3D === 'true' ? remote : local;
}

export const ASSETS_3D: Asset3dManifest = {
  heroCore: resolve(
    LOCAL_ASSETS_3D.heroCore,
    REMOTE_ASSETS_3D.heroCore,
    process.env.NEXT_PUBLIC_HERO_CORE_URL
  ),
  environment: resolve(
    LOCAL_ASSETS_3D.environment,
    REMOTE_ASSETS_3D.environment,
    process.env.NEXT_PUBLIC_ENVIRONMENT_MAP_URL
  ),
};
