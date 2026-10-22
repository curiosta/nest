# Ask NEST chat widget: notices

| File | Origin | License |
|---|---|---|
| `widget.js` | [manojsahukar/copilot-sdk-browser-tutor](https://github.com/manojsahukar/copilot-sdk-browser-tutor) `public/widget.js`, commit 329e61e, unchanged (sha256 137cbedde552e00034618d08141d5fe714a5f4fd4359316c394171fd3f4eaedc; its optional Hugging Face provider is left OFF: no data-providers / data-hf-client-id set) | MIT |
| `widget.css` | Adapted from the same repo (`public/widget.css`), NEST skin (site palette) | MIT |
| `vendor/marked.min.js` | [marked](https://github.com/markedjs/marked) v14.1.3 | MIT |
| `vendor/purify.min.js` | [DOMPurify](https://github.com/cure53/DOMPurify) v3.4.17 (npm `dompurify@3.4.17`, `dist/purify.min.js`, sha256 cd37898f9782adf54820c413191b5691803f0f137c799d6edcfd38523b4c2c31) | Apache-2.0 OR MPL-2.0 |
| `site-index.json` builder (`build-site-index.mjs`) | The same browser-tutor repo, `scripts/build-site-index.mjs` @ 329e61e (unchanged since 4a8b038) | MIT |

All files are self-hosted on nest.curiosta.com. The widget talks only to `https://openrouter.ai` (sign-in and chat),
using the visitor's own OpenRouter account. NEST holds no keys and runs no backend.
