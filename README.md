# Guardian Construction Website

Metro Detroit's full-service general contractor — interior remodels & exterior renovation.

## Site Structure

```
/
├── index.html              ← Homepage
├── logo.png                ← Nav logo (add before deploying)
├── images/
│   ├── guardian_white_text.png   ← Footer logo (add before deploying)
│   ├── roofing.png
│   ├── siding.png
│   ├── gutters.jpg
│   ├── insulation.jpg
│   ├── masonry.jpg
│   ├── windows.jpg
│   ├── drywall.png
│   ├── flooring.png
│   ├── kitchen.jpg
│   ├── bathroom.jpg
│   ├── basement.jpeg
│   └── garage.jpg
├── cities/
│   └── [74 city landing pages].html
├── sitemap.xml
└── _redirects              ← Netlify redirect rules
```

## Before Going Live

1. Add `logo.png` to the root folder
2. Add `images/guardian_white_text.png` to the images folder
3. Verify EmailJS keys in `index.html` (PUBLIC_KEY, SERVICE_ID, TEMPLATE_ID)
4. Update `sitemap.xml` with your final domain if not `guardianbuild.com`
5. Set up Google Business Profile and submit sitemap to Google Search Console

## Deploying to Netlify

1. Push this repo to GitHub
2. Log in to [netlify.com](https://netlify.com) → Add new site → Import from GitHub
3. Build command: *(leave blank — static site)*
4. Publish directory: `/` (root)
5. Click Deploy

## Contact

- Phone: (313) 247-1064
- Email: info@guardianbuild.com
