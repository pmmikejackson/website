# CLAUDE.md

Personal/professional site for Mike Jackson, served at https://www.mikejacksonpm.com (migrated off Wix, Nov 2026).

## Commands

No Node on the host Mac — run Node through Docker (OrbStack):

```bash
docker run --rm -it -v "$PWD":/app -w /app -p 4321:4321 node:22-alpine npm run dev   # dev server on :4321
docker build -t mjpm-site . && docker run --rm -p 8090:80 mjpm-site                 # production image on :8090
```

`npm run build` outputs static HTML to `dist/`. No test suite.

## Architecture

Astro static site, no client-side JavaScript.

- `src/site.ts` — site-wide facts (name, email, links, stats, nav, blog categories). Edit here first.
- `src/content/blog/*.md` — blog posts ("Insights"). Front matter schema in `src/content.config.ts`. The file name is the URL slug (`/blog/<slug>`). Set `draft: true` to hide a post from production builds. Post images live in `public/images/blog/`.
- `src/pages/` — one file per page. `src/layouts/Base.astro` holds the header, footer and meta tags.
- `src/styles/global.css` — all styling; colors are CSS variables on `:root` with a `prefers-color-scheme: dark` override.

Pages build as `about.html`, `blog/<slug>.html` (`build.format: 'file'`); nginx serves them at extensionless URLs.

## nginx.conf

- 301s for old Wix URLs (`/post/*`, `/solutions`, `/blank-1`, `/blog/categories/*`, `/_files/ugd/*`). Keep these.
- Redirects `themikejackson.com` and bare `mikejacksonpm.com` to `https://www.mikejacksonpm.com`.

## Deployment

Push to `main` → GitHub Actions builds `ghcr.io/pmmikejackson/website:latest` → Watchtower on the Synology NAS pulls it into the `website` container (port 8082) → public traffic arrives through the `cloudflared` tunnel. Pushing to `main` is a production deploy.
