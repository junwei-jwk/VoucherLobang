# Voucher Lobang King

A buildless, responsive Singapore ticket storefront for GitHub Pages. All enquiries go to Telegram @jasonjwkk. Carousell: https://www.carousell.sg/u/voucherlobangking/.

## GitHub Pages

Publish the contents of `dist/` at the root of the separate `VoucherLobang` repository. In GitHub Settings → Pages choose **Deploy from a branch**, **main**, **/(root)**. The storefront is available at https://junwei-jwk.github.io/VoucherLobang/.

The GitHub account name remains part of GitHub Pages URLs. A custom domain is required to remove that name without changing the GitHub account. The customer-facing brand is Voucher Lobang King; the Tally website is preserved.

## Admin

Open `admin.html` on your HTTPS website. Create a short-lived **fine-grained personal access token** in GitHub Settings → Developer settings → Personal access tokens. Restrict it to **VoucherLobang** and grant only **Contents: read and write**. Paste it into the admin connection form. Never paste it into this chat or commit it to a repository.

GitHub enforces writes. The editor HTML is public, as are the catalogue and site settings. Visitors can explore drafts, but publishing requires valid repository write credentials. The token is kept only in the current page's JavaScript memory, sent only to api.github.com, and cleared on disconnect, refresh, page exit or 15 minutes of inactivity. No shared password is embedded in the website. There are no third-party scripts in the admin page. Uploaded raster images are compressed and stored in the public catalogue; do not upload private material.

Edit tickets, prices (blank means “Enquire for price”), images, categories, availability, featured picks, order, colours, spacing, branding, homepage text, contact links and FAQs. Drafts save locally. Use live preview and backup download before publishing. Publishing updates `site.json` with its current SHA and refuses to overwrite a concurrent change. GitHub Pages republishes after the commit; allow a few minutes.

The source path and deployment branch are in `admin-config.json`. Update them if the repository changes. Token expiration and repository branch protection are enforced by GitHub.

## Content

No prices, seller ratings, payment methods, response-time guarantees or refund policies have been invented. Photos are illustrative Unsplash images, and the storefront labels them accordingly. Replace them in admin with images you are authorized to use. All ticket terms must be confirmed with Jason before payment.

Telegram opens the seller chat with an encoded draft. Visitors still press Send in Telegram. A Copy enquiry fallback is provided because Telegram clients may handle drafts differently.

## Local preview

Serve `dist/` over HTTP, for example `python -m http.server 4173 --directory dist`. Open http://localhost:4173/. No package installation or build is required.

## Reference

GitHub's Contents API: https://docs.github.com/en/rest/repos/contents

GitHub Pages setup: https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site

## Package reference catalogue

The seven Klook listings were reviewed on 11 October 2026. The catalogue includes 65 concise package reference choices and paraphrased terms summaries, with direct links to the full live listings. Promotions and source policies are not seller promises; imported options are marked reference-only until the owner confirms supply and terms. Prices remain blank.

In Admin → Tickets → Edit, edit package names, inclusions, specific terms, visibility, reference status, source URL, checked date and common source terms. Add or remove options as needed. Catalogue validation and backups preserve these fields. Check the source again before updating the checked date. This is a dated manual import, not an automatic scraper or scheduled synchronisation.
