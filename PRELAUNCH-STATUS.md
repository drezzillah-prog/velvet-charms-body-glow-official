# Velvet Charms Body Glow — prelaunch status

Internal handoff only. This file is not customer-facing.

## Completed on the safe preview branch

- 52 catalogue products preserved, including 6 refill products.
- Server-side RO/INTL pricing and visitor-access geolocation logic.
- Multi-product cart and quantity handling.
- PayPal create/capture with server-side price validation and exact cart fingerprint binding.
- Customizations, preferred date and private reference-photo metadata are bound to the approved PayPal order.
- PayPal cancel/return handling and idempotent payment recovery.
- Seller handoff after successful payment with order/capture IDs, customer/order details and signed private reference links.
- Private Vercel Blob photo storage.
- Shipping disclosure: checkout total is product-only; shipping is separately quoted and never charged without approval.
- EN / RO / FR / IT / DE localization and language persistence.
- Velvet Universe and current ritual experiences.
- Mobile/performance safeguards, including reduced-motion support and narrow-screen cart/customizer handling.
- robots.txt, sitemap.xml and initial page/social metadata.
- Automated prelaunch suite: catalogue/checkout integrity, capture security, Contact, seller handoff, PayPal return, end-to-end order flow and static page/asset/API-route audit.
- Current branch is ahead of `main` and not behind it. `main` has intentionally not been changed.

## Verified negative checkout scenarios

Automated tests reject changed price/PayPal amount, changed customization, changed preferred date and changed reference pathname after PayPal approval. They also cover failed/non-completed capture and already-completed-order recovery without double capture.

## External / owner-gated items before production

1. Confirm the real Formspree environment value in Vercel and perform one real Contact delivery test.
2. Perform one real low-value PayPal transaction only with explicit owner approval.
3. Complete authenticated visual browser QA on representative mobile + desktop viewports, including all five languages and German long-text wrapping.
4. Supply verified trader/company details before publishing final Terms / Trader Information / Privacy wording.
5. Do not sell cosmetic SKUs until their real EU compliance documentation and label data are complete (Responsible Person, CPSR/PIF, CPNP, INCI/Article 19 label data, claims support and related requirements as applicable).
6. Complete applicable product-safety/traceability checks for non-cosmetic Body Glow goods.
7. Set final canonical/production-domain metadata after the final domain is confirmed.
8. Merge to `main` / production only after explicit owner approval.

## Do not redo

Do not replace the current RO pricing with a direct currency conversion. Do not make shipping-address country decide Romanian pricing. Do not re-enable Resend for the current launch flow. Do not expose internal future-roadmap copy in Velvet Universe. Do not remove existing products, images, customizations, refill/ritual features or five-language localization.
