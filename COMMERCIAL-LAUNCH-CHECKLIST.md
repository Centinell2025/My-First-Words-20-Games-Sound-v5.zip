# My First Words — $4.99 Commercial Launch Readiness

**Status:** Pre-launch prototype. Do not advertise a paid product until all blockers are resolved.

## Offering
- Working title: My First Words — Early Language Learning
- Intended audience: parents/caregivers of children ages 1–3
- Proposed price: USD $4.99 one time per family (subject to platform pricing/taxes)
- English and Spanish language play; 20 picture games, 80 prompts

## Release-blocking checklist
- [ ] Upload and verify original chosen cover image `cover-official.webp` and document commercial usage rights
- [ ] Check copyrights/licensing of artwork, fonts, audio, generated content and source code
- [ ] Test on actual iPhone and Android devices: first-tap audio, voice availability, pronunciation, mute, correct/incorrect answers, responsive UI and offline behavior
- [ ] Obtain developmental/educational review for age-appropriateness; avoid promises of teaching a child to talk, speech therapy, or developmental treatment
- [ ] Create and review a public privacy policy identifying the operator, hosting/payment providers and actual data processing; assess COPPA obligations
- [ ] Keep all payment actions, external links and account settings in a verified adult-controlled section, not on toddler game screens
- [ ] Choose a sales channel: web checkout with server-side access control, Google Play paid app, or Apple App Store paid app
- [ ] Implement real purchase verification, entitlements, restore access, refund support and customer support
- [ ] Confirm business banking, tax details, terms of sale and refund information with the chosen provider
- [ ] Deploy to HTTPS and test the complete purchase lifecycle before public launch

## Technical warning
GitHub Pages and Azure Static Website publicly serve static assets. A payment link alone does **not** secure the 20 game files: paid access requires an authenticated backend or choosing a paid app-store distribution model. Never put payment secrets in `index.html` or browser JavaScript.

## Children’s safety
Avoid ads, trackers, microphones or child profiles by default. Adult-assisted, short sessions are appropriate; toddlers should primarily learn from real people and their surroundings.

## Useful official references
- FTC COPPA: https://www.ftc.gov/business-guidance/resources/complying-coppa-frequently-asked-questions
- Google Play Families: https://support.google.com/googleplay/android-developer/answer/9893335
- Apple Kids: https://developer.apple.com/kids/
