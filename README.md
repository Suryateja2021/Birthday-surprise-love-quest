# Birthday Surprise Website 💗

A static romantic birthday website built with HTML, CSS, and vanilla JavaScript. No backend or framework required.

## Files

- `index.html` — page structure and editable messages
- `style.css` — dreamy pink styling and animations
- `script.js` — music control, gallery, love notes, candles, and interactions
- `assets/` — your photos and optional music

## Add your own photos

The project includes soft placeholder illustrations so the gallery works before you add your pictures. Replace the placeholder photos with your own images.

For easiest setup, name your photos `photo1.jpg` through `photo8.jpg`. Then in `index.html`, replace each matching `photoN.svg` path with `photoN.jpg` (this appears in both the `src` and `data-photo` attributes). The first photo is also used in the final surprise section.

To show only 6 photos, remove the photo-card blocks for photos 7 and 8.

## Add background music

Place a music file you have permission to use at `assets/music.mp3`. Music starts after the visitor clicks the opening surprise button if the browser permits it. They can also use the music button in the top-right corner.

## Personalize the website

Open `index.html` and replace:
- `[YOUR NAME]` with your name
- Sample captions with your own memories
- Generic letter paragraphs with personal details, nicknames, or moments only the two of you know

You can also change “my favorite person” and “my love” in the opening and hero sections.

## Run locally

1. Extract the folder.
2. Add your photos and optional `assets/music.mp3`.
3. Double-click `index.html` to open it in your browser.

For a local development server, open the folder in VS Code and use the Live Server extension if you have it installed.

## Publish free with GitHub Pages

1. Create a GitHub repository, for example `birthday-surprise`.
2. Upload `index.html`, `style.css`, `script.js`, and the `assets` folder to the repository root.
3. Open **Settings → Pages**.
4. Under build and deployment, choose **Deploy from a branch**, select `main` and `/ (root)`, then save.
5. Wait for deployment to finish and open the published URL shown on the Pages settings screen.

Before sharing the link, test it on a phone and confirm all photo filenames and the music path match exactly. GitHub Pages URLs are public to anyone who has the link; don't upload photos you want to keep private.


## Love Quest game

New files: `game.html`, `game.css`, and `game.js`. The game has six stages and reveals the birthday wish only after all correct answers. It uses plain HTML/CSS/vanilla JavaScript and needs no backend. Edit the `stages` array in `game.js` to personalize the questions and answers; edit the ending section in `game.html` to change the birthday message and sign-off. Upload the changed `index.html` and all three game files to the root of your existing GitHub repository.
