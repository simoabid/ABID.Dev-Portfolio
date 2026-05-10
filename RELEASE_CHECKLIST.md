# Release Checklist

Use this checklist before merging a release branch into `main`. Every merge to `main` triggers a production deployment on Vercel.

---

## Pre-merge Verification

### Code Quality

- [ ] `npm run lint` — zero errors
- [ ] `npx tsc --noEmit` — zero type errors
- [ ] `npm run format:check` — all files formatted
- [ ] No `console.log` or `debugger` statements in production code
- [ ] No `TODO` or `FIXME` comments for this release scope

### Build

- [ ] `npm run build` — successful production build
- [ ] Build output is reasonable (First Load JS ≤ 200 kB for `/`)
- [ ] No new build warnings introduced

### Performance

- [ ] Lighthouse Performance ≥ 80 (desktop)
- [ ] Lighthouse Accessibility ≥ 90 (desktop)
- [ ] Lighthouse Best Practices ≥ 90 (desktop)
- [ ] Lighthouse SEO ≥ 90 (desktop)
- [ ] LCP ≤ 2.5s
- [ ] CLS ≤ 0.1
- [ ] TBT ≤ 200ms
- [ ] No new render-blocking resources introduced

### Accessibility

- [ ] `npm run test:a11y` — zero critical/serious violations
- [ ] Keyboard-only navigation works for all interactive elements
- [ ] Focus-visible styles present on all new controls
- [ ] Color contrast ≥ 4.5:1 for body text (WCAG 2.1 AA)
- [ ] Screen reader tested for major flows (VoiceOver or NVDA)

### Visual QA

- [ ] Desktop layout verified (1920px, 1440px, 1280px)
- [ ] Tablet layout verified (768px, 1024px)
- [ ] Mobile layout verified (375px, 414px)
- [ ] Dark mode renders correctly
- [ ] Light mode renders correctly
- [ ] Animations play smoothly (no janky transitions)
- [ ] `prefers-reduced-motion` disables animations

### Functionality

- [ ] Contact form submits successfully (test in mock mode)
- [ ] All navigation links work (header, footer, CTAs)
- [ ] Smooth scroll operates correctly between sections
- [ ] Cookie banner appears on first visit
- [ ] Cookie banner respects consent choice
- [ ] Project filter pills switch categories correctly
- [ ] External links open in new tabs with `rel="noopener noreferrer"`

### Environment

- [ ] `.env.example` is updated with any new variables
- [ ] No secrets or API keys committed to the repository
- [ ] Vercel environment variables are configured for new keys (if any)

### Documentation

- [ ] README updated if features changed
- [ ] CONTRIBUTING.md still accurate
- [ ] New components are documented with JSDoc

---

## Deployment

### Automatic (Vercel)

Merging to `main` automatically triggers:

1. Vercel detects the push
2. Runs `npm run build` in production mode
3. Deploys to the production domain
4. Previous deployment is preserved for instant rollback

### Manual Verification Post-deploy

- [ ] Production URL loads without errors
- [ ] Open DevTools Console — no runtime errors
- [ ] Contact form test submission works
- [ ] GTM/GA4 fires after cookie consent (if configured)
- [ ] Preview deployments for open PRs still work

### Rollback

If the production deployment has issues:

1. Go to Vercel Dashboard → Deployments
2. Find the previous successful deployment
3. Click **"Promote to Production"**
4. Revert the merge commit on `main` if needed:
   ```bash
   git revert <merge-commit-hash>
   git push origin main
   ```

---

## Version Tagging (Optional)

For milestone releases, tag the merge commit:

```bash
git tag -a v1.x.x -m "Release v1.x.x — description"
git push origin v1.x.x
```

---

## Current Baselines

Reference these values to detect regressions:

| Metric                       | Baseline | Date       |
| ---------------------------- | -------- | ---------- |
| First Load JS                | 166 kB   | 2026-05-10 |
| Lighthouse Performance       | 99       | 2026-05-10 |
| Lighthouse Accessibility     | 100      | 2026-05-10 |
| Lighthouse Best Practices    | 96       | 2026-05-10 |
| Lighthouse SEO               | 100      | 2026-05-10 |
| LCP                          | 0.7s     | 2026-05-10 |
| TBT                          | 10ms     | 2026-05-10 |
| CLS                          | 0        | 2026-05-10 |
| axe-core critical violations | 0        | 2026-05-10 |
