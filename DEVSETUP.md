# Development Setup

Step-by-step guide to run ABID.Dev Portfolio locally.

## Prerequisites

| Tool        | Version | Check           |
| ----------- | ------- | --------------- |
| **Node.js** | ≥ 20.x  | `node -v`       |
| **npm**     | ≥ 10.x  | `npm -v`        |
| **Git**     | ≥ 2.40  | `git --version` |

## 1. Clone the Repository

```bash
git clone https://github.com/simoabid/ABID.Dev-Portfolio.git
cd ABID.Dev-Portfolio
```

## 2. Install Dependencies

```bash
npm install
```

This also runs `husky` to set up Git pre-commit hooks.

## 3. Configure Environment

```bash
cp .env.example .env.local
```

Open `.env.local` and configure as needed. **All variables are optional** — the app runs in mock mode without them.

| Variable                       | Purpose                        | Default                      |
| ------------------------------ | ------------------------------ | ---------------------------- |
| `MAIL_PROVIDER`                | Email service for contact form | `console` (logs to terminal) |
| `RESEND_API_KEY`               | Resend API key                 | —                            |
| `SENDGRID_API_KEY`             | SendGrid API key               | —                            |
| `CONTACT_EMAIL`                | Where submissions are sent     | —                            |
| `NEXT_PUBLIC_CAPTCHA_PROVIDER` | `recaptcha` or `hcaptcha`      | disabled                     |
| `NEXT_PUBLIC_GTM_ID`           | Google Tag Manager container   | disabled                     |
| `NEXT_PUBLIC_SITE_URL`         | Canonical site URL             | `https://abidev.dev`         |

## 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The page auto-reloads on file changes.

## 5. Verify Setup

Run all quality checks to confirm everything works:

```bash
# Lint
npm run lint

# Type-check
npx tsc --noEmit

# Format check
npm run format:check

# Production build
npm run build

# Start production server (optional)
npm start
```

## Available Scripts

| Command                   | Description                                   |
| ------------------------- | --------------------------------------------- |
| `npm run dev`             | Development server with hot reload            |
| `npm run build`           | Production build                              |
| `npm start`               | Start production server                       |
| `npm run lint`            | ESLint check                                  |
| `npm run format`          | Auto-format with Prettier                     |
| `npm run format:check`    | Check formatting without modifying            |
| `npm run test:a11y`       | Accessibility audit (requires running server) |
| `npm run optimize:images` | Generate optimized image variants             |
| `npm run analyze`         | Bundle analysis visualization                 |

## Project Structure

```
.
├── .github/
│   ├── workflows/           # CI/CD pipelines
│   │   ├── ci.yml           # Lint, typecheck, build, a11y
│   │   ├── lighthouse-ci.yml # Performance scoring
│   │   └── image-optimize.yml # Image optimization
│   └── pull_request_template.md
├── public/
│   ├── images/              # Source images
│   │   ├── projects/        # Project screenshots
│   │   └── raw/             # Images for optimization pipeline
│   └── optimized/           # Generated (gitignored)
├── scripts/
│   ├── optimize-images.js   # Image optimization pipeline
│   └── test-a11y.js         # axe-core accessibility audit
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Root layout (fonts, providers, nav)
│   │   ├── page.tsx         # Home page (Hero + dynamic sections)
│   │   ├── globals.css      # Global styles, animations, utilities
│   │   └── api/contact/     # Serverless contact form endpoint
│   ├── components/
│   │   ├── Hero.tsx         # Hero section (LCP — statically imported)
│   │   ├── Projects.tsx     # Projects section (dynamically imported)
│   │   ├── About.tsx        # About section (dynamically imported)
│   │   ├── Skills.tsx       # Skills section (dynamically imported)
│   │   ├── Experience.tsx   # Experience section (dynamically imported)
│   │   ├── Contact.tsx      # Contact section (dynamically imported)
│   │   ├── Header.tsx       # Navigation header
│   │   ├── Footer.tsx       # Site footer
│   │   ├── Three/           # Three.js / R3F components (lazy-loaded)
│   │   └── ...              # Other UI components
│   ├── context/
│   │   └── ThemeProvider.tsx # Light/dark theme context
│   ├── data/
│   │   └── projects.ts      # Project content and types
│   ├── lib/
│   │   ├── scroll.ts        # GSAP + Lenis + ScrollTrigger singleton
│   │   └── textSplit.tsx     # Text splitting utility
│   └── styles/
│       └── tokens.css       # Design tokens (colors, spacing, fonts)
├── .env.example             # Environment variable template
├── next.config.js           # Next.js + bundle analyzer config
├── tailwind.config.ts       # Tailwind CSS + custom theme
├── tsconfig.json            # TypeScript configuration
├── CONTRIBUTING.md          # Contribution guidelines
├── DEVSETUP.md              # This file
└── RELEASE_CHECKLIST.md     # Pre-release verification steps
```

## Architecture Decisions

### Dynamic Imports

Below-fold sections (Projects, About, Skills, Experience, Contact) are dynamically imported in `page.tsx` to reduce the initial JS bundle. Only `Hero` is statically imported as it contains the LCP element.

### GSAP + Lenis

All animation libraries are centralized in `src/lib/scroll.ts`. The `SmoothScrollProvider` is dynamically imported with `ssr: false` to defer the entire gsap + lenis bundle (~117KB) from the SSR critical path.

### Design Tokens

Colors, spacing, and typography are defined as CSS custom properties in `src/styles/tokens.css`. All components reference these tokens via `var(--color-*)` for consistent theming.

### Image Strategy

- Hero portrait uses `next/image` with `priority` for LCP
- Project images use `next/image` with appropriate `sizes`
- Source images go in `public/images/`, optimized variants in `public/optimized/` (gitignored)

## Troubleshooting

### Port already in use

```bash
npx kill-port 3000
npm run dev
```

### Font loading errors during build

Build-time font fetches may fail without internet. The app still works — fonts fall back to system monospace.

### axe-core audit fails to connect

The accessibility audit requires a running server. Start `npm run dev` first, then run `npm run test:a11y` in a separate terminal.

### Husky hooks not running

```bash
npx husky install
```

## IDE Setup

### VS Code (recommended)

Install these extensions:

- **ESLint** — Real-time linting
- **Prettier** — Auto-format on save
- **Tailwind CSS IntelliSense** — Class name autocomplete
- **TypeScript Importer** — Auto-import suggestions

Add to `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```
