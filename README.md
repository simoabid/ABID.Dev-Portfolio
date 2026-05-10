# ABID.Dev Portfolio

> Premium portfolio built with Next.js, TypeScript, Tailwind CSS, GSAP, and Lenis smooth scroll.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view your portfolio.

## 📁 Project Structure

```
.
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   ├── data/            # Project data and content
│   ├── lib/             # Utilities (GSAP, Lenis, text splitting)
│   └── styles/          # Global styles and design tokens
├── public/
│   ├── images/          # Source images
│   └── optimized/       # Auto-generated optimized images
├── scripts/             # Build and optimization scripts
└── .github/workflows/   # CI/CD automation
```

## 🖼️ Image Optimization Pipeline

This portfolio includes an automated image optimization pipeline that generates multiple formats and sizes for optimal performance.

### How It Works

1. **Place raw images** in `public/images/raw/` or any subdirectory of `public/images/`
2. **Run optimization** locally or let CI handle it automatically
3. **Optimized variants** are generated in `public/optimized/`

### Running Locally

```bash
# Optimize all images in public/images/raw
npm run optimize:images

# Specify custom source directory
node scripts/optimize-images.js --source ./public/images/projects

# Specify custom output directory
node scripts/optimize-images.js --source ./path/to/images --output ./public/opt

# Show help
node scripts/optimize-images.js --help
```

### Generated Output

For each source image, the pipeline generates:

**Formats:**

- **AVIF** - Best compression (~50% smaller than JPEG), modern browsers
- **WebP** - Good compression (~30% smaller than JPEG), wide support
- **PNG** - Universal fallback, all browsers

**Sizes:**

- `thumbnail` - 400px width
- `small` - 800px width
- `medium` - 1200px width
- `large` - 1920px width
- `xlarge` - 2560px width

**Example output structure:**

```
public/optimized/
├── thumbnail/
│   ├── hero-image.avif
│   ├── hero-image.webp
│   └── hero-image.png
├── small/
│   └── ...
├── medium/
│   └── ...
└── large/
    └── ...
```

### CI/CD Integration

The GitHub Actions workflow automatically:

- ✅ Detects when images are added/modified in PRs
- ✅ Runs optimization on changed images only
- ✅ Generates all formats and sizes
- ✅ Uploads optimized images as artifacts
- ✅ Posts a summary comment on the PR
- ✅ Prevents large unoptimized images from merging

**Workflow triggers:**

- Automatically on PRs that modify `public/images/**`
- Manually via GitHub Actions UI

### Best Practices

1. **Source images** - Use high-quality source files (PNG or JPEG)
2. **Don't commit optimized** - Add `public/optimized/` to `.gitignore`
3. **Use Next.js Image** - Leverage automatic format selection:
   ```tsx
   <Image
     src="/optimized/medium/hero.avif"
     alt="Hero image"
     width={1200}
     height={800}
   />
   ```
4. **Responsive images** - Use different sizes for different viewports
5. **Check artifacts** - Review optimization results in PR artifacts

## 🎨 Technology Stack

### Core

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety and better DX
- **Tailwind CSS** - Utility-first styling with custom design tokens

### Animation

- **GSAP** - Professional-grade animation library
- **ScrollTrigger** - Scroll-driven animations
- **Lenis** - Smooth inertial scrolling

### Optimization

- **Sharp** - High-performance image processing
- **Next.js Image** - Automatic image optimization and lazy loading

### Development

- **ESLint** - Code quality and consistency
- **Prettier** - Code formatting
- **Husky** - Git hooks for pre-commit linting
- **lint-staged** - Run linters on staged files

## 🛠️ Available Scripts

| Command                   | Description                                                         |
| ------------------------- | ------------------------------------------------------------------- |
| `npm run dev`             | Start development server on [localhost:3000](http://localhost:3000) |
| `npm run build`           | Create production build                                             |
| `npm start`               | Start production server                                             |
| `npm run lint`            | Run ESLint to check for issues                                      |
| `npm run format`          | Format code with Prettier                                           |
| `npm run format:check`    | Check if code is formatted correctly                                |
| `npm run test:a11y`       | Run axe-core accessibility audit against dev server                 |
| `npm run optimize:images` | Run image optimization pipeline                                     |

## ♿ Accessibility Compliance

This portfolio targets **WCAG 2.1 Level AA** conformance. Accessibility is treated as a first-class requirement, not an afterthought.

### Compliance Status

| Criterion                        | Status |
| -------------------------------- | ------ |
| No critical axe-core violations  | ✅     |
| No serious axe-core violations   | ✅     |
| Keyboard-only full navigation    | ✅     |
| Skip-to-content link             | ✅     |
| Color contrast ≥ 4.5:1 (body)    | ✅     |
| Focus-visible on all controls    | ✅     |
| Screen reader landmark structure | ✅     |
| prefers-reduced-motion support   | ✅     |
| Modal focus trap (mobile menu)   | ✅     |
| ARIA progressbar roles           | ✅     |

### Implemented Features

- **Skip link**: First focusable element — `Tab` jumps straight to `#main-content`
- **Landmark roles**: All sections have `aria-label` for screen reader navigation (`nav`, `main`, `footer`)
- **Focus-visible rings**: 2px accent outline on every interactive element (links, buttons, inputs)
- **Keyboard operability**: Mobile nav opens/closes with `Escape`, cookie banner dismissible with `Escape`, all tab stops reachable
- **Color contrast**: `--color-foreground-muted` boosted to ≥ 4.5:1 ratio on both dark and light backgrounds
- **ARIA attributes**: Progress bars have `role="progressbar"` + `aria-valuenow`, decorative elements use `aria-hidden="true"`, nav links use `aria-current="page"`
- **Reduced motion**: `prefers-reduced-motion: reduce` disables all GSAP and CSS animations globally

### Running the Audit

```bash
# Start dev server first
npm run dev

# In a separate terminal, run the audit
npm run test:a11y

# Or specify a custom URL
A11Y_BASE_URL=https://abid.dev npm run test:a11y
```

The audit script (`scripts/test-a11y.js`) uses axe-core + Puppeteer to test against WCAG 2.1 AA tags. It exits with code 1 if any critical or serious violations are found, making it CI-ready.

## 📝 Development Workflow

### Adding New Projects

1. Edit `src/data/projects.ts`
2. Add project images to `public/images/projects/`
3. Run `npm run optimize:images`
4. Reference optimized images in project data

### Adding New Sections

1. Create component in `src/components/`
2. Add to `src/app/page.tsx`
3. Add scroll animations with GSAP if needed

### Styling Guidelines

- Use design tokens from `src/styles/tokens.css`
- Follow Tailwind utility-first approach
- Keep components modular and reusable
- Use `var(--color-*)` for theme-aware colors

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Deploy automatically on every push

### Manual Deployment

```bash
npm run build
npm start
```

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
cp .env.example .env.local
```

### 📬 Contact Form Setup

The contact form works **out of the box** in mock mode — submissions are logged to the server console. To enable real email delivery:

#### Option A: Resend (Recommended)

1. Create a free account at [resend.com](https://resend.com) (3,000 emails/month)
2. Get your API key from the dashboard
3. Update `.env.local`:
   ```env
   MAIL_PROVIDER=resend
   RESEND_API_KEY=re_xxxxxxxxxxxx
   RESEND_FROM_EMAIL=Portfolio <onboarding@resend.dev>
   CONTACT_EMAIL=your@email.com
   ```

#### Option B: SendGrid

1. Create an account at [sendgrid.com](https://sendgrid.com) (100 emails/day free)
2. Create an API key with "Mail Send" permission
3. Update `.env.local`:
   ```env
   MAIL_PROVIDER=sendgrid
   SENDGRID_API_KEY=SG.xxxxxxxxxxxx
   SENDGRID_FROM_EMAIL=noreply@yourdomain.com
   CONTACT_EMAIL=your@email.com
   ```

#### Option C: Console (Default / Development)

No configuration needed. Submissions are printed to the terminal.

### 🛡️ Captcha Setup (Optional)

Captcha is **disabled by default**. To enable spam protection:

#### reCAPTCHA v3

1. Register at [google.com/recaptcha](https://www.google.com/recaptcha/admin)
2. Choose **reCAPTCHA v3** and add your domain
3. Update `.env.local`:
   ```env
   NEXT_PUBLIC_CAPTCHA_PROVIDER=recaptcha
   NEXT_PUBLIC_CAPTCHA_SITE_KEY=6Le...
   RECAPTCHA_SECRET_KEY=6Le...
   ```

#### hCaptcha

1. Register at [hcaptcha.com](https://dashboard.hcaptcha.com)
2. Update `.env.local`:
   ```env
   NEXT_PUBLIC_CAPTCHA_PROVIDER=hcaptcha
   NEXT_PUBLIC_CAPTCHA_SITE_KEY=xxxx
   HCAPTCHA_SECRET_KEY=xxxx
   ```

### Image Optimization Settings

Edit `scripts/optimize-images.js` to customize:

- Output formats
- Size breakpoints
- Quality levels
- Compression settings

## 📄 License

MIT License - feel free to use this portfolio as a template for your own projects.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

**Built with ❤️ by Mohamed Amine Abid**
