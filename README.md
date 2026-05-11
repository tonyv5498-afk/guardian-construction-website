# Guardian Construction Website

Metro Detroit's full-service general contractor — interior remodels & exterior renovation.

---

## File Structure

```
guardian-construction/
├── index.html
├── sitemap.xml
├── vercel.json                         ← Vercel config (caching, redirects, headers)
├── .gitignore
├── .github/
│   └── workflows/
│       └── deploy.yml                  ← Auto-deploy to Vercel on every push
├── images/
│   ├── guardian_white_text.png         ← Add this (footer logo)
│   ├── kitchen.jpg
│   ├── bathroom.jpg
│   ├── basement.jpeg
│   ├── garage.jpg
│   ├── roofing.png
│   ├── siding.png
│   ├── gutters.jpg
│   ├── insulation.jpg
│   ├── masonry.jpg
│   ├── windows.jpg
│   ├── drywall.png
│   └── flooring.png
└── logo.png                            ← Add this to root (nav logo)
```

---

## Step 1 — GitHub Setup

### First time (new repo)

```bash
git init
git add .
git commit -m "Initial commit — Guardian Construction website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/guardian-construction.git
git push -u origin main
```

### Every future update

```bash
git add .
git commit -m "describe what you changed"
git push
```

Vercel auto-deploys within ~30 seconds of every push.

---

## Step 2 — Vercel Setup

### Connect Vercel to GitHub (one-time)

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **Add New → Project**
3. Select the **guardian-construction** repo
4. Framework Preset: **Other** (static site)
5. Root Directory: `.` (leave as default)
6. Click **Deploy**

### Connect your custom domain

1. Vercel dashboard → your project → **Settings → Domains**
2. Add `guardianbuild.com` and `www.guardianbuild.com`
3. Add these DNS records at your domain registrar:
   - **A record**: `@` → `76.76.21.21`
   - **CNAME**: `www` → `cname.vercel-dns.com`
4. SSL is automatic — live within 5 minutes

---

## Step 3 — GitHub Actions Secrets (for auto-deploy)

The `deploy.yml` workflow needs three secret keys. Set these up once.

### Get your Vercel tokens

1. Go to [vercel.com/account/tokens](https://vercel.com/account/tokens) → **Create** → copy the token
2. Install Vercel CLI: `npm i -g vercel`
3. Run `vercel link` in your project folder
4. Open `.vercel/project.json` — copy `orgId` and `projectId`

### Add secrets to GitHub

Go to your repo → **Settings → Secrets and variables → Actions → New repository secret**

| Secret Name | Value |
|---|---|
| `VERCEL_TOKEN` | Token from vercel.com/account/tokens |
| `VERCEL_ORG_ID` | orgId from .vercel/project.json |
| `VERCEL_PROJECT_ID` | projectId from .vercel/project.json |

---

## Step 4 — Google Search Console

1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. Add property → `https://guardianbuild.com`
3. Verify via DNS TXT record
4. Submit sitemap: `https://guardianbuild.com/sitemap.xml`

---

## Daily Workflow

```
Edit files → git add . → git commit -m "notes" → git push
                                                      ↓
                                          Vercel deploys in ~30 sec
                                                      ↓
                                          Live at guardianbuild.com
```

---

## Contact

- Phone: (313) 247-1064
- Email: info@guardianbuild.com
