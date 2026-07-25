'use client';

import { Environment, useTexture } from '@react-three/drei';
import { EquirectangularReflectionMapping, SRGBColorSpace } from 'three';

import { ASSETS_3D } from '@/lib/assets3d';

/**
 * Image-based lighting sourced from the generated panorama.
 *
 * `<Environment files={...} />` cannot be used here. Internally it calls
 * drei's `useEnvironment`, which switches on the file extension and only
 * understands `.hdr`, `.exr`, `.jpg`/`.jpeg` or an array of six cube faces.
 * Our panorama is a `.png`, so that path throws
 * `useEnvironment: Unrecognized file extension` before the scene can mount.
 *
 * Loading the image through `useTexture` sidesteps the extension check
 * entirely — it is a plain TextureLoader call, so any format the browser can
 * decode works. Passing the result as `map` still lets Environment run it
 * through PMREM, so roughness and metalness respond correctly.
 *
 * Caveat: the panorama is 16:9 rather than a true 2:1 equirectangular
 * projection, because the generator snapped the requested aspect ratio to the
 * nearest supported one. Reflections are therefore stretched slightly in the
 * vertical axis. It reads fine as ambient lighting, but it is not a
 * physically accurate environment.
 */
export default function GeneratedEnvironment() {
  const texture = useTexture(ASSETS_3D.environment);

  // Assigned during render rather than in an effect: Environment consumes the
  // texture on the very first frame, and an effect would run too late, letting
  // PMREM prefilter it with the wrong mapping. Both writes are idempotent.
  texture.mapping = EquirectangularReflectionMapping;
  texture.colorSpace = SRGBColorSpace;

  return <Environment map={texture} background={false} />;
}

useTexture.preload(ASSETS_3D.environment);
