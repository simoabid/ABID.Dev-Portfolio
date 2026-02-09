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
| `npm run optimize:images` | Run image optimization pipeline                                     |

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

Create `.env.local` for local development:

```env
# Add your environment variables here
NEXT_PUBLIC_SITE_URL=https://yoursite.com
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
