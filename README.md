# Xuan-Yan Chen | Academic Website

An English academic website for Xuan-Yan Chen at HKUST: research, publications, scientific software, and an academic biography.

Public site: <https://shanelogic.github.io/>

## Development

Install Ruby 3.4 and Bundler, then run:

```sh
bundle install
bundle exec jekyll serve --host 127.0.0.1 --port 4178
```

Open `http://127.0.0.1:4178/`. Changes to `_config.yml` require restarting Jekyll.

On a Mac using Homebrew's versioned Ruby, add `/opt/homebrew/opt/ruby@3.4/bin` to the command's PATH. Do not use the macOS system Ruby for this project.

## Updating content

| Content | Source |
| --- | --- |
| Identity, contact, education, awards | `_data/profile.yml` |
| Navigation | `_data/navigation.yml` |
| Research themes | `_data/research.yml` |
| Publications | `_publications/*.md` |
| Software and detail pages | `_projects/*.md` |
| Layout and reusable entries | `_layouts/`, `_includes/` |
| Appearance and interactions | `assets/css/site.css`, `assets/js/site.js` |
| Image provenance | `ASSETS.md` |

Add one Markdown file per publication. Preserve the published author order and DOI. Set `featured: true` and `featured_order` for homepage selections. `year`, `topic`, and `sort_order` control the publication directory. BibTeX is generated from the same metadata, so it does not need a second manually maintained list.

The optional `bib_authors` field supports explicit `Family, Given` names for compound surnames. Exported titles retain their capitalization, including chemical symbols.

Topics currently used by the filters are `lattice`, `defects`, `learning`, and `synthesis`. The publication list supports multi-word search, year/topic combinations, clear/reset, shareable query parameters, and an empty state. The complete list remains readable without JavaScript.

Project Markdown front matter supplies links, media, and the summary. Its body becomes a detail page. Add only working documentation and repository links. Label representative structures accurately; do not imply that an illustration is a calculated trajectory or software screenshot.

This release intentionally has no CV download or PDF. The original CV and private planning notes are not part of the repository. Do not copy them into `assets` or `_data`.

## Build and verify

```sh
JEKYLL_ENV=production bundle exec jekyll build --strict_front_matter
python3 scripts/check_site.py
```

The checker validates internal paths and anchors, asset references, HTML language and headings, bibliographic exports, JSON-LD, and the absence of private PDFs/development files in the generated site. Browser verification additionally covers navigation, filtering, copying citations, image dialogs, responsive layout, and image loading.

The browser verification function is in `scripts/check_browser.js`. With Playwright CLI installed, open the local site in an isolated session and invoke that function:

```sh
playwright-cli --session academic open http://127.0.0.1:4178/
playwright-cli --session academic run-code --filename=scripts/check_browser.js
```

It covers nine routes at 320, 390, 768, and 1440 pixels, plus publication controls, citations, mobile navigation, image dialogs, and reading with JavaScript disabled. Screenshots are written to the ignored `output/playwright/` directory.

### Icons

Only the required Lucide icons are bundled. The generated file is committed so ordinary content updates do not require Node.js.

```sh
npm ci
npm run build:icons
```

Add or remove icons in `scripts/icons.js` when changing icon names in templates.

## Deployment

The `pages.yml` workflow builds and checks pull requests. Pushes to `main` also deploy the generated `_site` artifact to GitHub Pages. In repository Settings > Pages, select **GitHub Actions** as the publishing source.

The production URL is controlled by `url` in `_config.yml`. If adding a custom domain, update the GitHub Pages setting and DNS, enable HTTPS, and update this URL. The default user-site `baseurl` is empty.

## Credits and sources

The Jekyll collection/template approach is adapted from [Shitong Luo's academic-homepage](https://github.com/luost26/academic-homepage), inspected at commit `7bd10b6af57d52fd74ba1dd0e0f5aa4b6419c97e`. The responsive layout and interactions are customized for this site; the upstream MIT notice is retained.

Icons: [Lucide](https://lucide.dev/), ISC license. Core content and images are served locally without analytics, remote fonts, or live publication API calls.

Publication metadata was checked against the author's supplied academic records, [ORCID](https://orcid.org/0000-0002-7055-7387), and publisher records on 2026-10-01. The list is maintained explicitly; it is not a live Scholar mirror. Research summaries are brief paraphrases, not verbatim publisher abstracts.
