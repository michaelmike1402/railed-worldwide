# RAILED Worldwide

The official mobile-first RAILED Worldwide campaign website.

- Website: https://michaelmike1402.github.io/railed-worldwide/
- Repository: https://github.com/michaelmike1402/railed-worldwide

## Structure

`site/` is the complete buildless website. `site/assets/` contains six optimized photos in three resolutions, the transparent original brand mark, and the locally hosted Anton font with its SIL Open Font License. The supplied brand artwork and photographs remain the property of their respective rights holders.

No framework, dependency installation, third-party scripts, analytics, cookies, or application secrets are needed. All resource paths are relative, so GitHub project Pages works without a special base path.

## Local preview

Serve `site/` with any static HTTP server, for example `python -m http.server 8357 --directory site`. Open http://localhost:8357. Run `node scripts/check.mjs` to validate the release assets and links.

## Deployment

GitHub Settings → Pages → Source is set to **GitHub Actions**. Every push to `main` runs `.github/workflows/deploy.yml`, validates the source, and publishes only `site/`. The workflow can also be run manually from the Actions tab. Deployment uses GitHub's temporary workflow token; no personal token or deployment secret is needed.

## Maintenance

- Edit the heading, copy, and purchase/social destinations in `site/index.html`. Keep external links set to `target="_blank"` with `rel="noopener noreferrer"`.
- Edit layout and responsive styling in `site/styles.css`.
- Update slide order and per-image crop positions in `site/slideshow.js`. Keep the initial image and preload in `index.html` synchronized when changing the first slide.
- Six original campaign photographs are included as optimized WebP files, in 640, 1280, and 2400-pixel widths. EXIF rotation is applied, metadata is removed, and full aspect ratios are preserved. Keep the same three sizes when replacing a photograph. CSS handles viewport cropping.
- `railed-logo.png` is a transparent, tightly cropped extraction of the supplied metallic logo, with its proportions preserved.
- Images change every five seconds with a 1.3-second crossfade. The next image is decoded before switching. Slow or failed downloads keep the current image visible. Background tabs suspend rotation. Reduced-motion visitors see a still image with entrance/hover animations disabled.
- Restore an earlier version by reverting the relevant commit on `main`; the same workflow publishes the restored source.

## Photo mapping

1. `_MG_1555 (1).JPG` — group campaign
2. `DSC00050.JPG` — stairway
3. `_MG_0036.JPG` — two models
4. `_MG_0006.JPG` — gray tee
5. `_MG_0116.JPG` — car interior
6. `_MG_0005.JPG` — black tee

The website intentionally contains no gallery, slide controls, extra sections, or visible destination URLs. The photo-only backdrop is decorative to assistive technology; the brand, headline, and links retain accessible text.
