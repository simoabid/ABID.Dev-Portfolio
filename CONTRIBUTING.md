# Contributing to ABID.Dev Portfolio

Thank you for considering contributing! This document covers the conventions, workflows, and quality standards for this project.

## Table of Contents

- [Getting Started](#getting-started)
- [Branch Naming](#branch-naming)
- [Commit Conventions](#commit-conventions)
- [Development Workflow](#development-workflow)
- [Adding a New Project](#adding-a-new-project)
- [Optimizing Images](#optimizing-images)
- [Adding a 3D Model](#adding-a-3d-model)
- [Code Standards](#code-standards)
- [Pull Request Process](#pull-request-process)
- [CI Pipeline](#ci-pipeline)

---

## Getting Started

See [DEVSETUP.md](./DEVSETUP.md) for full local development instructions.

```bash
git clone https://github.com/simoabid/ABID.Dev-Portfolio.git
cd ABID.Dev-Portfolio
npm install
cp .env.example .env.local
npm run dev
```

## Branch Naming

Use the following prefixes:

| Prefix      | Use Case                | Example                          |
| ----------- | ----------------------- | -------------------------------- |
| `feat/`     | New feature             | `feat/projects/case-study-page`  |
| `fix/`      | Bug fix                 | `fix/header/mobile-menu-scroll`  |
| `chore/`    | Maintenance, CI, docs   | `chore/ci/lighthouse-workflow`   |
| `refactor/` | Code restructuring      | `refactor/components/hero-split` |
| `perf/`     | Performance improvement | `perf/images/avif-delivery`      |

Always branch from `main`.

## Commit Conventions

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:** `feat`, `fix`, `chore`, `refactor`, `perf`, `docs`, `style`, `test`, `ci`

**Examples:**

```
feat(projects): add case study detail page with MDX support
fix(header): prevent body scroll when mobile menu is open
perf(hero): lazy-load CodeSnippet below fold
chore(ci): add Lighthouse CI workflow with PR comments
```

## Development Workflow

1. **Create a branch** from `main`
2. **Make changes** locally, test with `npm run dev`
3. **Run quality checks** before committing:
   ```bash
   npm run lint          # ESLint
   npm run format:check  # Prettier
   npx tsc --noEmit      # TypeScript
   npm run build         # Production build
   ```
4. **Commit** — Husky pre-commit hooks will auto-lint staged files
5. **Push and open a PR** — CI will run automatically
6. **Fill out the PR template** — include preview URL for UI changes
7. **Request review** — address feedback, then merge

---

## Adding a New Project

### 1. Add project data

Edit `src/data/projects.ts` and add a new entry to the `projects` array:

```typescript
{
  id: 'my-project',
  title: 'My Project Title',
  slug: 'my-project',
  tagline: 'One-line hook that grabs attention',
  description: 'Full description of what the project does...',
  challenge: 'What problem did this solve?',
  outcome: 'Measurable result (e.g., "3x faster load times")',
  role: 'Your role on the project',
  technologies: ['Next.js', 'TypeScript', 'PostgreSQL'],
  category: 'full-stack',       // 'full-stack' | 'frontend' | 'backend' | 'mobile'
  image: '/images/projects/my-project.png',
  liveUrl: 'https://my-project.com',   // optional
  repoUrl: 'https://github.com/...',   // optional
  featured: false,                      // set true for the hero spotlight
}
```

### 2. Add project image

Place a high-resolution screenshot (≥ 1200px wide, PNG or JPEG) in:

```
public/images/projects/my-project.png
```

### 3. Optimize the image

```bash
npm run optimize:images
```

This generates AVIF, WebP, and PNG variants at multiple sizes in `public/optimized/`.

### 4. Test locally

```bash
npm run dev
```

Navigate to the Projects section and verify the card renders correctly with your image, title, and metadata.

### 5. Mark as featured (optional)

To make your project the hero spotlight card, set `featured: true` on your entry and `featured: false` on the existing featured project.

---

## Optimizing Images

### Local workflow

```bash
# Optimize all images in public/images/raw/
npm run optimize:images

# Custom source directory
node scripts/optimize-images.js --source ./public/images/projects

# Custom output
node scripts/optimize-images.js --source ./path/to/images --output ./public/opt
```

### Generated output

For each source image, the pipeline generates:

- **Formats:** AVIF (best compression), WebP (wide support), PNG (fallback)
- **Sizes:** thumbnail (400px), small (800px), medium (1200px), large (1920px), xlarge (2560px)

### CI integration

When a PR modifies files in `public/images/**`, the Image Optimization workflow runs automatically, generates variants, uploads artifacts, and posts a summary comment.

### Best practices

1. Use high-quality source files (PNG or JPEG, ≥ 1200px wide)
2. Don't commit `public/optimized/` — it's in `.gitignore`
3. Reference images with `next/image` for automatic format negotiation:
   ```tsx
   <Image
     src="/images/projects/my-project.png"
     alt="My Project screenshot"
     width={1200}
     height={800}
     sizes="(max-width: 768px) 100vw, 50vw"
   />
   ```

---

## Adding a 3D Model

The project includes a `src/components/Three/` directory for Three.js / React Three Fiber components.

### 1. Add your model

Place GLTF/GLB files in `public/models/`:

```
public/models/my-model.glb
```

### 2. Create a viewer component

Create `src/components/Three/MyModel.tsx`:

```tsx
'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const Scene = dynamic(() => import('./MyModelScene'), { ssr: false });

export default function MyModel() {
  return (
    <Suspense
      fallback={
        <div className="h-64 animate-pulse bg-[var(--color-surface)]" />
      }
    >
      <Scene />
    </Suspense>
  );
}
```

### 3. Install dependencies (if not already present)

```bash
npm install three @react-three/fiber @react-three/drei
npm install -D @types/three
```

### 4. Dynamic import in the page

Always use `dynamic()` with `ssr: false` for Three.js components to avoid SSR issues and keep bundle size manageable:

```tsx
const MyModel = dynamic(() => import('@/components/Three/MyModel'), {
  ssr: false,
  loading: () => <div className="h-64 animate-pulse" />,
});
```

---

## Code Standards

### TypeScript

- Strict mode enabled — no `any` unless absolutely necessary
- Use interfaces for component props, types for unions/utility types
- Export one component per file

### Styling

- Use Tailwind CSS utilities for all styling
- Use design tokens from `src/styles/tokens.css` via `var(--color-*)`
- Theme-aware: all colors must work in both light and dark modes

### Components

- All page-level components are client components (`'use client'`)
- Use `next/image` for all images
- Use `next/link` for internal navigation
- Add `aria-label` to all interactive elements without visible text
- Decorative elements must have `aria-hidden="true"`

### Animations

- Use GSAP for scroll-triggered and complex animations
- Import from `@/lib/scroll` (centralized gsap + ScrollTrigger)
- Respect `prefers-reduced-motion` — the global CSS override disables all animations

### Performance

- Dynamically import below-fold sections and heavy libraries
- Use `priority` on the hero LCP image only
- Provide `sizes` attribute on all `next/image` instances

---

## Pull Request Process

1. **Fill out the PR template** completely
2. **Include a preview URL** for any UI change (Vercel auto-generates these)
3. **All CI checks must pass** before requesting review
4. **One approval required** to merge
5. **Squash-merge** to keep `main` history clean
6. **Delete the branch** after merging

### Quality gates enforced by CI

| Check          | Tool       | Threshold                        |
| -------------- | ---------- | -------------------------------- |
| Lint           | ESLint     | Zero errors                      |
| Types          | TypeScript | Zero errors                      |
| Format         | Prettier   | All files formatted              |
| Build          | Next.js    | Successful production build      |
| Accessibility  | axe-core   | Zero critical/serious violations |
| Performance    | Lighthouse | Performance ≥ 80                 |
| Accessibility  | Lighthouse | Accessibility ≥ 90               |
| Best Practices | Lighthouse | Best Practices ≥ 90              |

---

## CI Pipeline

### Workflows

| Workflow                                  | Trigger                         | Purpose                                    |
| ----------------------------------------- | ------------------------------- | ------------------------------------------ |
| **CI** (`ci.yml`)                         | PR + push to `main`             | Lint, typecheck, format, build, a11y audit |
| **Lighthouse** (`lighthouse-ci.yml`)      | PR + push to `main`             | Performance and accessibility scoring      |
| **Image Optimize** (`image-optimize.yml`) | PR modifying `public/images/**` | Generate optimized image variants          |

### Deployment

- **Production:** Merging to `main` triggers automatic deployment on Vercel
- **Preview:** Every PR gets a unique Vercel preview URL
- **Rollback:** Revert the merge commit on `main` to redeploy previous version

---

## Questions?

Open an issue or reach out to [Mohamed Amine Abid](https://github.com/simoabid).
