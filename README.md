# Canopryx Web

Astro website for Canopryx.

## Stack

- Astro
- TypeScript
- Bun for package management and scripts

## Project Structure

```text
src/
  components/
  layouts/
  pages/
  styles/
public/
```

## Commands

```bash
bun install
bun run dev
bun run check
bun run build
bun run preview
```

## Notes

- Bun is the only supported package manager; `bun.lock` is the source of truth.
- Astro performs strict TypeScript checks before every production build.

## Production environment

Configure these variables in Vercel:

```text
RESEND_API_KEY=re_...
CONTACT_FROM_EMAIL=Canopryx Contact <contact@canopryx.com>
CONTACT_TO_EMAIL=contact@canopryx.com
```

`CONTACT_FROM_EMAIL` must use a domain verified in Resend. The recipient falls
back to `contact@canopryx.com` when `CONTACT_TO_EMAIL` is not configured.
