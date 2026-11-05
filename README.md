# My First Words Kids — 20 Games With Sound

Parent-guided early-language web app for children ages 1–3.

## Eight languages, both directions

English, Spanish, French, Brazilian Portuguese, German, Italian, Japanese and Korean.

Choose **I speak** and **I am learning** above the cover or game. The **⇄** button reverses the pair. All 56 ordered pairs are supported across 20 topics and 80 picture prompts. Each picture shows both words; the audio plays the source word followed by the learning word with a voice matching each language. Game instructions use the source language. The selected pair is saved on this device only. Learning progress is separate for each direction and lasts for the current session.

The existing cover, animal sounds, large picture choices, helpful feedback, next button, age tips, speech speed and mute controls remain. A correct answer advances automatically after the bilingual speech finishes. Back, mute, language changes and repeat controls cancel stale speech; repeating after a correct answer restarts the advance timer.

## Open and test

- Run `npm start` or serve the repository as static files. Open the site on a phone or computer.
- Choose two different languages and open a game. Tap **Hear both languages**; check the two words and pronunciations, then tap **⇄** and check the reverse direction.
- In the parent voice settings, choose the learning-language voice and speaking speed. The source-language voice is selected automatically from matching installed voices.
- Voices depend on the browser and operating system. A missing voice is reported; the app never deliberately substitutes a voice in another language. Download both voice packs on the phone for offline speech. The visual game continues without voices.
- Test correct and incorrect choices, replay, mute, changing languages while a game is open, automatic progression and leaving a game.
- Run `npm test` for translation completeness, all 4,480 bilingual picture prompts, voice order, reverse pronunciation, missing voices, mute and interrupted speech.

## Validation for this update

- All 56 directions checked in the browser with the first picture.
- All 20 category names and 80 prompts checked programmatically in all eight languages.
- Browser checks covered the reverse button, wrong-choice hint, disabled next before a correct answer, progress, automatic advancement across game boundaries and the end of the last game.
- Speech routing tested with simulated native-language voices. The development browser had no installed voices, so audible pronunciation and real Android/iPhone behavior still need device verification.
- New translations need native-speaker editorial review before a production store release.

## Google Play and native releases

This repository contains the web/PWA source; it does not contain the signed Android application project or an AAB. Updating this source does **not** upload a new Google Play build, change its review state or confirm public distribution. To ship these changes in the Android app, include `index.html`, `languages.js`, `app.js` and the existing assets in the Android project, verify the supported speech engine, increment its version code, build/sign an AAB and use the existing release process.

The GitHub Pages workflow publishes web-source changes pushed to `main`; verify its deployment result in Actions.

## Parent notes

Play together in short sessions and prioritize real-world interaction. This app is a vocabulary activity, not speech therapy or a diagnostic tool. No account, ads, microphone, analytics or uploads of children's data are added. Device speech services may have their own network requirements.

## Files

- `index.html`: existing visual shell and bilingual language controls
- `languages.js`: 20 topics, original English/Spanish words and six additional translations; interface labels and animal sounds
- `app.js`: language pairs, voice sequence, game flow and local session progress
- `sw.js`: PWA cache, including the language and game scripts
- `server.js`: static server with the new JavaScript assets allowed
- `tests/languages.test.cjs`: Node test runner checks
