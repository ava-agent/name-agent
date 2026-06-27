# Name Agent Deployment

- Production URL: `https://name.rxcloud.group`
- Repository: `ava-agent/name-agent`
- Platform: Vercel
- Framework Preset: Next.js

## Required Environment Variables

| Name | Required | Notes |
|---|---|---|
| `ARK_API_KEY` | Yes | Server-side Ark CodingPlan key for name generation. |
| `ARK_BASE_URL` | Yes | Ark OpenAI-compatible CodingPlan base URL. |
| `ARK_CHAT_MODEL` | Yes | Ark CodingPlan chat model. |
| `NEXT_PUBLIC_VOICE_INPUT_ENABLED` | No | Keep `false` until Volcengine speech recognition is implemented. |
| `NEXT_PUBLIC_SUPABASE_URL` | No | Reserved public browser config. Keep empty when Supabase is not used. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | No | Reserved public browser config. Keep empty when Supabase is not used. |

Use `.env.local.example` as the template. Never commit `.env.local`.

## Vercel Settings

- Install Command: `npm install`
- Build Command: `npm run build`
- Output: Vercel-managed Next.js output
- Node.js: 18+

## Pre-Deploy Checks

```bash
npm run test
npm run build
```

## Post-Deploy Checks

1. Open `https://name.rxcloud.group`.
2. Check the home page quick-name flow.
3. Check the full card flow at `/flow`.
4. Confirm `/api/generate` has access to the Ark server-side environment variables through Vercel.
5. Confirm `/api/transcribe` returns the expected disabled response while voice input remains off.
