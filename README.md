<p align="center">
  <img src="docs/icons/icon.svg" width="88" alt="Book Translator app icon" />
</p>

<h1 align="center">Book Translator</h1>

<p align="center">
  <strong>Read in English. Remember what you learn.</strong>
</p>

<p align="center">
  Look up unfamiliar words while reading, save them with context, and turn them into vocabulary you actually remember.
</p>

<p align="center">
  <a href="https://karlos-ai.github.io/book-translator/"><strong>Try the live app</strong></a>
  · <a href="#how-it-works">How it works</a>
  · <a href="#run-locally">Run locally</a>
</p>

![Book Translator: translation, flashcards, and vocabulary list](.github/screenshots.png)

## Why I built it

I read books in English, but looking up a word does not mean I will remember it the next time I see it. I wanted a way to keep reading, capture unfamiliar vocabulary in the context of the book, and review it later without managing a separate flashcard app.

Book Translator is that small, personal reading companion. It borrows the straightforward feel of a phone translator, but connects each lookup to a learning workflow.

## Features

| | What it does |
| --- | --- |
| **Translate while reading** | English ↔ German word lookups as you type. The bundled dictionary handles common words offline, including inflected forms, parts of speech, and phrases. Full-sentence translation uses an online service. |
| **Save words in context** | Looked-up words and short phrases are saved automatically. Add the sentence from your book to remember where you saw them. |
| **Tap words in a passage** | Paste a paragraph from an e-book and tap unfamiliar words; the surrounding sentence is captured as context. |
| **Actually learn them** | Review flashcards with spaced repetition, typing practice, and multiple-choice questions in both directions. |
| **Keep control of your list** | Search, filter by learning status, edit entries, and export vocabulary as JSON backup or CSV. |

The app also supports pronunciation, light and dark appearance, and installation on an iPhone home screen. No account is required.

## How it works

1. **Read** an English book or paste a paragraph into the **Book page** section.
2. **Look up** a word you do not know. Save its meaning and, optionally, the sentence you found it in.
3. **Review** the automatically created flashcards. The SM-2-style schedule brings words back when they are due.
4. **Export** your vocabulary whenever you want a backup or a CSV for another learning tool.

### Use it on your phone

Open the [live app](https://karlos-ai.github.io/book-translator/) in Safari on your iPhone. To add it to your home screen, tap **Share → Add to Home Screen**. It runs as an installable web app, without an App Store download.

## Run locally

The app has no runtime package dependencies. You only need Node.js to generate its static site and Python 3 to serve it locally:

```sh
git clone https://github.com/karlOS-ai/book-translator.git
cd book-translator
node tools/build.mjs
python3 -m http.server 8000 --directory docs
```

Open **http://localhost:8000** in your browser.

To run the build verification tests:

```sh
node --test tests/*.test.mjs
```

### Architecture

This is deliberately a small, dependency-free frontend rather than a framework app. The application currently lives in one HTML/CSS/JavaScript source file; a build script packages it as a static progressive web app for GitHub Pages.

| Path | Purpose |
| --- | --- |
| [`src/app.html`](src/app.html) | App interface and client-side behavior |
| [`src/core-en.json.gz`](src/core-en.json.gz) | Compressed core dictionary embedded at build time (~76,000 words) |
| [`tools/build.mjs`](tools/build.mjs) | Produces the deployable site, manifest, icons references, and service worker |
| [`tools/build_dict.py`](tools/build_dict.py) | Prepares dictionary entries, inflections, and lookup shards |
| [`docs/`](docs/) | Generated static site deployed with GitHub Pages |
| [`tests/`](tests/) | Dependency-free build and PWA smoke tests |

GitHub Pages serves `docs/` from the `main` branch. After changing the source, run `node tools/build.mjs` and commit the updated generated files as well.

To **rebuild the dictionary itself**, you also need the Ding English–German source (for example the Ubuntu `trans-de-en` package) and the Python [`wordfreq`](https://github.com/rspeer/wordfreq) package:

```sh
python3 -m pip install wordfreq
python3 tools/build_dict.py /path/to/de-en
node tools/build.mjs
```

## Privacy & offline behavior

- Vocabulary and review progress are stored in your **browser's local storage**. There is no account or automatic cross-device sync.
- The bundled core dictionary supports common word lookups without a network connection. Less common entries may need to be downloaded before they are available offline.
- When an online translation is needed, the text being translated is sent to a third-party service (Google Translate or MyMemory). Do not enter sensitive or private text for online translation.
- Clearing browser/site data can delete your saved vocabulary. **Export a JSON backup periodically.**

## Roadmap

Ideas for future iterations, not features that are already shipped:

- Organize saved words by book and track progress per book.
- Make the reading view more central to the experience.
- Add optional camera/OCR input for printed book pages.
- Improve the desktop layout and simplify backups.

## Known limitations

- The interface is designed primarily for phone-sized screens.
- The current source is a single HTML file, which makes isolated unit tests and larger changes harder than they need to be.
- Online sentence translation depends on external services and may fail or change over time.
- Local storage does not replace a synced account or an exported backup.

## Credits & licensing

The English–German dictionary is based on **Ding** by Frank Richter / TU Chemnitz ([dictionary website](https://dict.tu-chemnitz.de/)), distributed under the **GNU GPL version 2 or later**. The dictionary build script prioritizes common meanings using [`wordfreq`](https://github.com/rspeer/wordfreq), normalizes inflected forms, and splits less frequent entries into smaller files.

The repository does not currently specify a separate license for the application code. Please review the relevant license terms before redistributing or adapting the code or bundled dictionary data.
