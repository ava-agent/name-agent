# Name Agent Working Guide

This project is a Next.js 16 app for AI-powered Chinese baby naming. Follow the root workspace rules first, then these project-specific notes.

## Local Rules

- Do not commit `.env.local` or real API keys. Use `.env.local.example` for shared variable names only.
- Use `npm` because this project has `package-lock.json`.
- Prefer the existing App Router structure under `app/`, shared UI under `components/`, state in `stores/`, and AI client/prompt logic under `lib/ai/`.
- Treat root-level PNG files as QA/product screenshots until they are reviewed. Do not delete or bulk-move them without an explicit cleanup task.
- `.playwright-mcp/` is local browser automation output and should stay ignored.

## Commands

```bash
npm run dev
npm run lint
npm run type-check
npm run test
npm run build
```

Use `npm run test` as the quick pre-change gate; run `npm run build` before deployment-oriented changes.

## Deployment

- Production URL: `https://name.rxcloud.group`
- Platform: Vercel
- Required Ark secrets: `ARK_API_KEY`, `ARK_BASE_URL`, `ARK_CHAT_MODEL`
- Optional public variables: `NEXT_PUBLIC_VOICE_INPUT_ENABLED`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Voice input is disabled by default until a Volcengine speech recognition integration is added.
