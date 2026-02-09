'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

function ViewerLoadingFallback() {
  return (
    <div className="flex h-[420px] w-full items-center justify-center rounded-3xl border border-white/10 bg-[linear-gradient(135deg,rgba(108,99,255,0.12),rgba(0,212,255,0.08))]">
      <div className="space-y-3 text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-[var(--color-accent)]" />
        <p className="text-sm font-medium text-white/80">
          Loading 3D runtime...
        </p>
      </div>
    </div>
  );
}

function PreviewFallback() {
  return (
    <div className="relative h-[420px] w-full overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_30%_20%,rgba(108,99,255,0.28),transparent_55%),radial-gradient(circle_at_80%_70%,rgba(0,212,255,0.2),transparent_50%),#070b14]">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/30 bg-cyan-300/5 blur-[1px]" />
      <p className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full border border-white/20 bg-black/50 px-4 py-1 text-[10px] uppercase tracking-[0.2em] text-white/70 backdrop-blur-sm">
        3D preview is idle
      </p>
    </div>
  );
}

const HelmetViewer = dynamic(() => import('./HelmetViewer'), {
  ssr: false,
  loading: ViewerLoadingFallback,
});

export default function HelmetContainer() {
  const [isViewerActive, setIsViewerActive] = useState(false);

  return (
    <article className="glass-card rounded-[2rem] p-5 sm:p-7">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-foreground-muted)]">
            Phase 9 Prototype
          </p>
          <h3 className="text-2xl font-bold tracking-tight text-[var(--color-foreground)] md:text-3xl">
            Interactive Helmet Viewer Skeleton
          </h3>
          <p className="max-w-2xl text-sm text-[var(--color-foreground-muted)] md:text-base">
            Lazy-loaded React Three Fiber scene with constrained orbit controls,
            environment lighting, and a placeholder low-poly helmet mesh.
          </p>
        </div>

        {!isViewerActive && (
          <button
            type="button"
            onClick={() => setIsViewerActive(true)}
            className="inline-flex items-center justify-center rounded-full border border-[var(--color-accent)] bg-[var(--color-accent)]/15 px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-foreground)] transition hover:scale-[1.02] hover:bg-[var(--color-accent)]/25 focus-ring"
            aria-label="Load interactive 3D helmet placeholder model"
          >
            Load model
          </button>
        )}
      </div>

      {isViewerActive ? <HelmetViewer /> : <PreviewFallback />}
    </article>
  );
}
