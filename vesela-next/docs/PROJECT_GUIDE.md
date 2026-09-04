# Vesela (vesela.ai) — Project Guide

Concise reference for frontend developers and coding agents. This is a **Next.js App Router** app (JavaScript / JSX, not TypeScript). UI is built with **MUI** plus custom CSS on marketing pages.

Full request/response contract lives in the portal backend repo: `foster-care/docs/API_AND_ENDPOINTS.md` (not in this repo). This guide covers what **this** frontend implements.

---

## What this app does

Vesela is a human-alignment AI product by Gray Sky AI. The site is both a marketing site and the chat product:

- **Marketing site** — Home, Pricing, Blog (HubSpot CMS)
- **Guest chat** — Unauthenticated HTTP chat with a daily free-message cap, then signup prompt
- **Authenticated chat** — Streaming WebSocket chat with conversation memory, history, and shareable links
- **Auth & plans** — Email/password + Google login; Free (Vesela Mini) vs Pro (Stripe)
- **Onboarding** — After signup: profile details + BALGO assessment (mood / energy / resilience)
- **Settings** — Appearance, subscription, password, privacy, model card, account delete

**Production site:** `https://vesela.ai`  
**Backend:** `https://portal.grayskyai.com`

### Sibling clients (same portal, different products)

Do not copy patterns from the other clients unless asked.

| Client | Product | Stack | Login | Billing | Chat |
|--------|---------|-------|-------|---------|------|
| **This app** | vesela.ai | Next.js 16 | Web: `/dj-rest-auth/login/` via `/api/proxy` | Stripe Payment Link / Billing Portal | WS authenticated; HTTP guest `/api/sales_incoming_vesela/` |
| Grace web | grayskyai.com | Vite + React SPA | Same **web** login via `/proxy-api` | Stripe | WS Vesela Mini/Pro; HTTP Claims Fighter |
| Android | GraceAI (`com.grayskyai.graceai`) | Kotlin + Compose | **Mobile:** `/api/auth/login/` JSON tokens | Google Play (`plan3`) | WS streaming |
| iOS | GreySkyAI | SwiftUI | Same mobile login; Keychain tokens | StoreKit 2 (`com.greyskyai.plan3`) | WS streaming |

Vesela has **one agent** (Vesela). Do not add Claims Fighter, service-planner / forms, Play Billing, StoreKit, or `POST /api/update_plan/` unless asked. `update_plan` is for native IAP on Grace mobile, not Stripe on this site.

---

## Tech stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router) |
| Language | JavaScript (`.jsx` / `.js`). Sparse `.d.ts` only for MUI / auth |
| UI | MUI 7 (`@mui/material`, `@mui/icons-material`, `@mui/x-date-pickers`, `@mui/material-nextjs`) |
| HTTP | Axios (`src/lib/axios.js`) via Next.js BFF proxy |
| Real-time | Native WebSocket `wss://portal.grayskyai.com/ws/chat/?token=<access>` |
| Forms | Formik + Yup |
| Animation | Framer Motion, Lottie |
| Markdown | react-markdown + remark-gfm + DOMPurify |
| Blog CMS | HubSpot (server-only token) |
| Billing | Stripe Payment Links + Customer Billing Portal |
| Path alias | `@/` → `src/` (`jsconfig.json`) |
| Deploy | Typical Next.js host (Vercel-style). No `vercel.json` in repo |

---

## Project structure

```
vesela-next/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (public)/             # Marketing: /, /home, /pricing, /blog
│   │   ├── (private)/            # Auth-gated: /welcome, /chat, /change-password
│   │   ├── share/[uuid]/         # Public shared conversation
│   │   ├── api/
│   │   │   ├── proxy/[...path]/  # BFF → portal.grayskyai.com
│   │   │   └── blog/             # HubSpot blog BFF
│   │   ├── layout.jsx            # Root: theme, auth, chat session, modals
│   │   ├── robots.js
│   │   └── sitemap.js
│   ├── components/
│   │   ├── chat/                 # ChatPage, bubbles, input, header, guest banner
│   │   ├── chat-history/         # History modal + list/preview
│   │   ├── home/                 # Marketing homepage sections
│   │   ├── public/               # PublicHeader, PublicFooter
│   │   ├── blog/
│   │   ├── pricing/
│   │   ├── user-auth/            # Login, signup, Google, forgot password
│   │   ├── onboarding/           # Update info + BALGO assessment
│   │   ├── setting/              # Settings modal tabs
│   │   ├── modals/               # AuthFlowManager, share, wrappers
│   │   ├── subscription/         # ManagePlanButton
│   │   └── ui/                   # Buttons, inputs, Lottie
│   ├── context/                  # AuthContext, ChatSessionContext, ModalContext
│   ├── hooks/                    # Login, signup, chat socket/history, assessment
│   ├── lib/                      # axios, apiService, tokenManager, siteConfig
│   ├── services/                 # auth, billing, update, hubspot
│   ├── theme/                    # MUI themes (public vs chat)
│   ├── utils/                    # storage, JWT, Stripe URL, brand
│   ├── AuthGuard.jsx             # Private-route gate
│   └── constant.js               # localStorage keys + chat max-width
├── public/                       # Lottie JSON, favicon, hero video
└── docs/                         # This guide
```

**Convention:** Route shells live in `src/app/`. Feature UI lives in `src/components/<feature>/`. Backend calls go through `src/lib/apiService.js` or a `src/services/*` wrapper. Do not call `portal.grayskyai.com` from the browser except the WebSocket URL.

---

## Key routes

| Path | Access | Purpose |
|------|--------|---------|
| `/` | Public | Marketing home. If a valid session exists, `ClientRedirect` sends the user to `/welcome` |
| `/home` | Public | Same marketing page **without** the authenticated redirect (noindex) |
| `/pricing` | Public | Mini vs Pro plans |
| `/blog`, `/blog/[...slug]` | Public | HubSpot-backed blog |
| `/welcome` | Private | Hero chat composer. Sending a message stores it and navigates to `/chat` |
| `/chat` | Private (layout) | Main chat UI. `ChatPage` still contains guest HTTP chat logic |
| `/change-password` | Private | Dedicated password page (also available in Settings) |
| `/share/[uuid]` | Public | Read-only shared conversation |

Route groups:

- `(public)` — `PublicHeader` / `PublicFooter`, public MUI theme
- `(private)` — `AuthGuard` + chat MUI theme, `robots: noindex`
- `share/` — noindex, no public chrome

**Post-login destination:** always `/welcome`, unless `postLoginNavigateTo` was stored first. `/welcome` is the authenticated entry point; do not treat `welcomeCompleted` as a reason to skip it.

**Guest vs private `/chat`:** Home hero and guest session code push users toward `/chat`, but `(private)/layout` wraps `/chat` in `AuthGuard`, which redirects unauthenticated users to `/`. If you change this, update both the layout and `ChatPage`.

---

## State & auth

### Providers (root `layout.jsx`)

`ThemeRegistry` → `AuthProvider` → `ChatSessionProvider` → `ModalProvider` → page + `GlobalModals`

Google Identity Services and GA (`G-CLPP6EXFWT`) load in the root layout.

### Auth model (critical)

This is a **cross-domain** web client: browser origin is `vesela.ai`, API origin is `portal.grayskyai.com`.

Django JWT cookies (`my-app-auth`, `my-refresh-token`) are **host-only**. They only persist on this site because the Next.js proxy **rewrites `Set-Cookie`** (drops `Domain`, sets `Path=/`, `SameSite=Lax`, `Secure` on HTTPS).

| Token | Where it lives | Used for |
|-------|----------------|----------|
| Access JWT | JSON body on login/refresh → memory + `sessionStorage` (`vesela_access_token`) | `Authorization: Bearer` on REST; `?token=` on WebSocket |
| Refresh JWT | HttpOnly cookie `my-refresh-token` (not readable from JS) | `POST /dj-rest-auth/token/refresh/` with empty JSON `{}` |
| User profile | `localStorage` key `userdetails` | Optimistic UI + `hasPlausibleSession()` |
| Plan | `localStorage` key `plan_details` | Pricing / Manage Plan |

Rules:

- Never store the access JWT in `localStorage`.
- Never call portal REST from the browser. Always `/api/proxy/...`.
- WebSocket **cannot** use vesela.ai cookies. It always needs `?token=<access>`.
- Do not call `/dj-rest-auth/user/` or `/token/refresh/` for anonymous visitors. Gate on `hasPlausibleSession()` (cached `user.pk` or a valid access token).
- Proxy timeouts / 503 are **transient**. Do not clear auth on them.

### `AuthContext` fields

`user`, `userId` (`user.pk`), `isAuthenticated`, `isSessionChecked`, `isTokenReady`, `wsToken`, `plan`, `planDetails`, `canManageStripeBilling`, `isPro`, `isFree`, `login()`, `logout()`, `fetchPlan()`.

Session hydrate on mount:

1. If no plausible session → treat as anonymous (no 401 noise).
2. Else `GET /dj-rest-auth/user/` (credentials + Bearer if present).
3. `ensureAccessToken()` so WebSocket has a JWT.
4. If user is set, `GET /api/get_plan/`.

Login: `login(user, access)` persists user + access. If access is missing, it force-refreshes from the cookie.

Logout: `POST /dj-rest-auth/logout/`, then clear tokens, user, plan, conversation id, and redirect to `/`.

### Axios

`src/lib/axios.js` — `baseURL: "/api/proxy"`, `withCredentials: true`.

- Request interceptor: proactive refresh if access expires within 1 hour; attach Bearer.
- Response interceptor: on 401, refresh once and retry, unless the URL is login/register/logout/Google/guest-chat, or there is no plausible session.

`src/lib/apiService.js` wraps calls as `{ status, data, error, message }`. Prefer this over raw axios.

`src/lib/tokenManager.js` is the only module that reads/writes the access token and talks to `/api/proxy/dj-rest-auth/token/refresh/`.

Custom events: `auth:sessionRefreshed`, `auth:sessionExpired`.

---

## Chat

Two transports, one UI (`components/chat/ChatPage.jsx`).

### Authenticated — WebSocket

Hook: `src/hooks/useChatSocket.js`  
URL: `wss://portal.grayskyai.com/ws/chat/?token=<access>`

Connect only when `isSessionChecked && isAuthenticated && isTokenReady`.

Client → server:

```json
{
  "user_id": 51,
  "text": "Hello Vesela",
  "conversation_id": 123,
  "time_zone": "America/Chicago"
}
```

Omit `conversation_id` to start a new thread. Active id is stored in `localStorage` as `vesela_active_conversation_id`. `/welcome` clears it so the next send starts a new conversation.

Server → client `type` values the hook handles:

| `type` | Meaning |
|--------|---------|
| `thinking` | Reply started; show streaming state |
| `stream_start` | Create empty assistant bubble |
| `chunk` | Append `content` to that bubble |
| `done` / `complete` | Stop streaming |
| `error` | Show `message`. If `expired: true`, drop conversation id and start fresh |
| `ping` / `pong` / `heartbeat` / `keepalive` | Ignored |

Reconnect:

- Close **4001** → refresh access token, reconnect (auth rejected).
- Retryable codes `1001, 1006, 1011–1014` → backoff; every 3rd failure does a hard reconnect (refresh token + new socket).
- Tab focus / `online` / visibility → reconnect.
- Access token rotation → reconnect without wiping the message queue.

Free-plan daily cap: 20 messages (UTC midnight reset). The 20th reply may include an upgrade suffix in the streamed text. The 21st send is `type: "error"` and the UI sets `isLocked` (`vesela_auth_limit_locked`).

### Guest — HTTP

Context: `src/context/ChatSessionContext.jsx`  
Endpoint: `POST /api/sales_incoming_vesela/` (Vesela-specific; portal docs also list `/api/sales_incoming/`)

First turn: `{ "text": "initial_message", "key": "" }`  
Later turns: `{ "text": "<user text>", "key": "<session key>" }`  
Success: HTTP **201**, `{ response: { key, text, showSignup } }`.

Guest state in `localStorage`: `vesela_guest_messages`, `vesela_guest_key`, `vesela_guest_signup_required`, `vesela_pending_hero_message`.

When `showSignup` is true (or known limit copy appears in the reply), the UI locks and opens the login modal.

Home / welcome both stash a pending hero message, then `/chat` consumes it once.

### History & share

| Action | Endpoint | UI |
|--------|----------|----|
| List threads | `GET /api/conversations/` | `useChatHistory` → History modal |
| Thread messages | `GET /api/chats/<id>/` | `useChatDetails` |
| Create share | `POST /api/share/` `{ conversation_id }` | `ShareModal` rewrites host to `vesela.ai/share/<uuid>` |
| Public share | `GET /api/share/<uuid>/` | `/share/[uuid]` |

Only Vesela `chat` conversations with messages can be shared.

---

## Plans & billing

Backend plan strings: `free`, `plan1`–`plan4`, `plan42`.  
Frontend: anything other than `"free"` is Pro (`isPro`). Paid Stripe users typically have `plan3`.

| UI | When | How |
|----|------|-----|
| Vesela 2 Mini | `plan === "free"` or logged out | 20 messages/day, no memory |
| Vesela 2 Pro | `$18.99/mo` | Unlimited, memory, live search |
| **Select Plan** | Logged in, cannot manage Stripe | Open Stripe Payment Link (currently hardcoded in `PricingPlansContent`; backend also has `GET/POST /api/get_stripe_payment_link/?brand=vesela`) |
| **Manage Plan** | `can_manage_stripe_billing === true` | `GET /api/customer_billing_portal/?brand=vesela` → open returned `url` |

Payment Link helper: `getStripePaymentUrl()` appends `prefilled_email` and `client_reference_id` (Django user pk).  
Brand helper: `getCurrentBrand()` → `"vesela"` on this app (`NEXT_PUBLIC_BRAND` or hostname).

After Stripe checkout, webhook upgrades the user. Return URL is `https://vesela.ai/chat?payment=success`. Cancel at period end keeps Pro until `customer.subscription.deleted`.

Do not use `POST /api/update_plan/` for production billing.

---

## API & environment

### Browser → Next → portal

```
Browser  --REST-->  /api/proxy/<django-path>/  -->  https://portal.grayskyai.com/<django-path>/
Browser  --WS---->  wss://portal.grayskyai.com/ws/chat/?token=<access>
Browser  --blog-->  /api/blog  -->  HubSpot (server token)
```

Proxy (`src/app/api/proxy/[...path]/route.js`):

- Forwards cookies, `content-type`, `accept`
- Adds `X-CSRFToken` from `csrftoken` cookie on mutating methods
- **Always trailing-slash** the upstream URL (Django)
- 8s upstream timeout → **503** `{ error: "upstream_unavailable" }` (keep session)
- Unexpected proxy errors → **500**
- Rewrites `Set-Cookie` onto the frontend domain

### Env vars

| Variable | Where | Purpose |
|----------|--------|---------|
| `NEXT_PUBLIC_SITE_URL` | Public | Canonical URL (default `https://vesela.ai`) |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Public | GIS client; fallback id exists in `GoogleLoginButton` |
| `NEXT_PUBLIC_BRAND` | Public | Force brand (`vesela` / `graysky` / `grayskyai`) |
| `HUBSPOT_ACCESS_TOKEN` | Server only | Blog API. Sample posts if missing |
| `HUBSPOT_API_BASE_URL` | Server | Default `https://api.hubapi.com` |
| `HUBSPOT_BLOG_ID` | Server | Optional HubSpot blog id filter |
| `HUBSPOT_BLOG_SLUG_PREFIX` | Server | Default `gray-sky-ai-blog`; also used for redirects |

No `.env` files are committed. Copy locally as needed.

### Endpoints this frontend actually calls

All REST paths below are relative to `/api/proxy`.

**Auth**

| Method | Path | Auth | Used by |
|--------|------|------|---------|
| POST | `/dj-rest-auth/login/` | none | `useLogin` |
| POST | `/dj-rest-auth/registration/` | none | `useSignUp` |
| POST | `/dj-rest-auth/logout/` | cookie/Bearer | `AuthContext.logout` |
| POST | `/dj-rest-auth/token/refresh/` | refresh cookie | `tokenManager` |
| GET | `/dj-rest-auth/user/` | cookie/Bearer | session hydrate |
| POST | `/api/auth/google/` | none | `{ id_token }` |
| POST | `/dj-rest-auth/password/change/` | required | Settings |
| POST | `/api/auth/password/forgot/` (fallbacks: `/auth/password/forgot/`, `/dj-rest-auth/password/reset/`) | none | Forgot password |
| POST | `/api/auth/password/forgot/confirm/` (same fallbacks) | none | Reset confirm |

Web login body: `{ email, password }`. Response includes `access` (JWT) and `user`. Refresh is `""` in JSON; real refresh is the cookie.

**User / plan / billing**

| Method | Path | Used by |
|--------|------|---------|
| GET | `/api/get_plan/` | `AuthContext.fetchPlan` |
| POST | `/api/update_user_info/` | Onboarding (`first_name`, `last_name`, `phone_number`, `date_of_birth`, `gender`) |
| POST | `/api/store_balgo_info/` | Assessment `{ ev, env, er, reason_for_support }` → 201 |
| GET | `/api/customer_billing_portal/?brand=vesela` | Manage Plan |
| DELETE | `/api/delete/` | Delete account |

**Chat**

| Method | Path | Auth | Used by |
|--------|------|------|---------|
| POST | `/api/sales_incoming_vesela/` | none | Guest chat |
| GET | `/api/conversations/` | required | History list (`data.Conversations`) |
| GET | `/api/chats/<id>/` | required | History messages (`data.Chats`) |
| POST | `/api/share/` | required | Create share |
| GET | `/api/share/<uuid>/` | none | Public share page |

**Not used by this frontend (portal has them):** HTTP `POST /api/incoming/`, forms / admission-assessment / service-planner APIs, `POST /api/update_plan/`, portal admin routes. Do not add them unless the product scope changes.

Common error shapes: DRF field errors; `{ detail: "..." }`; chat `{ status: "error", message, expired }`. Chat REST/WS often return that app error shape even when HTTP is 200.

---

## Auth & onboarding flows

Modals are a state machine in `AuthFlowManager` + `MODALS` (`src/components/modals/modalConstants.js`).

**Login:** Login → Success (navigate `/welcome`)  
**Signup:** Signup → Update info → Assessment one (gender + reason, `POST /api/update_user_info/`) → Assessment two (ev/env/er sliders, `POST /api/store_balgo_info/`) → Success / `/chat`  
**Forgot password:** Forgot password form (request + confirm) → Login  
**Google:** GIS `id_token` → `POST /api/auth/google/` → same Success path  

`source: "chat"` vs `"public"` switches modal theme (`getChatTheme` vs `getAppTheme`).

Settings (`SETTINGS_MODAL`): subscription, password, support, appearance, FAQ, terms, privacy, model card, logout, delete.

---

## UI patterns

- **Two MUI themes** — `getAppTheme` (marketing, primary `#176f9c`) and `getChatTheme` (in-app). Light/dark via `ColorModeContext`; persisted as `theme` / `vesela-theme`.
- **Marketing CSS** — `globals.css` + class names (`hero`, `reveal`, `home-page`). Public pages are not “MUI-only”.
- **Chat layout** — `CHAT_CONTAINER_MAX_WIDTH = clamp(480px, 61.8vw, 960px)` (golden-ratio column).
- **Modals** — `useModal()` + `AuthFlowManager`. Settings and history are separate dialogs from the chat header, not `MODALS.*`.
- **Forms** — Formik + Yup. Buttons via `CustomButton` where the auth/onboarding flow already uses it.
- **Fonts** — Inter, Manrope, IBM Plex Mono (next/font in root layout).
- **SEO** — `metadata` in App Router pages; private + share routes `noindex`. Sitemap: `/`, `/pricing`, `/blog`, plus HubSpot posts.

---

## Common tasks

| Task | Where to look |
|------|---------------|
| Add a public page | `src/app/(public)/<route>/page.jsx` + public layout chrome |
| Add a private page | `src/app/(private)/<route>/page.jsx` (AuthGuard is automatic) |
| Change chat send/stream/reconnect | `hooks/useChatSocket.js`, `components/chat/ChatPage.jsx` |
| Change guest chat | `context/ChatSessionContext.jsx` |
| Auth / session bugs | `lib/tokenManager.js`, `lib/axios.js`, `context/AuthContext.jsx`, `app/api/proxy/[...path]/route.js` |
| Login / signup / onboarding | `components/user-auth/`, `components/onboarding/`, `components/modals/AuthFlowManager.jsx` |
| New backend REST call | `lib/apiService.js` + optional `services/*.js` (path without `/api/proxy` prefix) |
| Plans / Stripe | `components/pricing/`, `services/billing.service.js`, `utils/stripeUtil.js` |
| Settings tab | `components/setting/` + `SETTINGS_MODAL` |
| Blog | `services/hubspot/blogApi.js`, `app/api/blog/` |
| Theme / colors | `theme/theme.jsx`, `theme/ThemeRegistry.jsx` |
| localStorage keys | `src/constant.js` and `ChatSessionContext` `STORAGE_KEYS` |

---

## Scripts

```bash
cd vesela-next
npm run dev      # Next.js dev server (localhost:3000)
npm run build    # Production build
npm run start    # Serve production build
npm run lint     # ESLint
```

Test API traffic against `/api/proxy`, not hardcoded portal REST URLs. The WebSocket URL in `useChatSocket.js` is the exception.

---

## Notes for contributors and agents

- No TypeScript for app code. Match existing JSX style.
- Django paths need a trailing slash; the proxy adds it. Keep service paths with a trailing slash anyway (`/api/get_plan/`).
- `user.pk` is the Django user id. WebSocket `user_id` must match the authenticated user.
- Guest chat is exempt from the axios 401-refresh loop so anonymous visitors are not hard-redirected.
- After login, guest session storage is cleared (`resetGuestSession`).
- Do not add Grace-only features (multi-agent picker, Claims Fighter HTTP chat, service planner) unless asked.
- Do not invent new auth cookie names or store refresh tokens in JS. Refresh is HttpOnly via the proxy.
- Backend source of truth for request/response shapes: portal `API_AND_ENDPOINTS.md` (backend repo `foster-care`). If this UI and that doc disagree, treat the portal as canonical and note the Vesela-specific guest path `/api/sales_incoming_vesela/`.
