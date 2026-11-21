# mikejacksonpm.com

Source for https://www.mikejacksonpm.com, Mike Jackson's personal and professional site. It's a static [Astro](https://astro.build) site served by nginx in Docker on a Synology NAS behind a Cloudflare tunnel.

- **Blog posts:** add a Markdown file to `src/content/blog/`.
- **Site facts** (email, links, stats): `src/site.ts`.
- **Resume:** edit `resume/resume.html`, then run `./resume/build.sh` to regenerate `public/files/mike-jackson-resume.pdf`.
- **Deploy:** push to `main`. GitHub Actions builds the image, and Watchtower on the NAS picks it up.

See `CLAUDE.md` for the local dev commands and architecture.
