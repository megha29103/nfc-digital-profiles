# NFC Digital Profile System

A reusable, no-database digital profile system for NFC cards.

## Core idea

Each NFC card stores only a URL. That URL opens a client's static profile.

Example:

https://YOUR-USERNAME.github.io/nfc-profile-system/clients/abc-salon/

Each client has their own folder, but all clients use the same reusable website engine.

## Folder structure

```text
nfc-profile-system/
├── client-template/
│   ├── index.html
│   ├── data.js
│   ├── script.js
│   ├── styles.css
│   └── assets/
│       └── images/
│           ├── logo.png
│           └── owner.jpg
└── clients/
    └── README.md
```

## Add a new client

1. Copy `client-template`.
2. Paste it inside `clients/`.
3. Rename it using a short URL-safe name, for example:
   - `abc-salon`
   - `rahul-ca`
   - `neuroedge-solutions`
4. Edit only `data.js`.
5. Replace the logo/photo inside `assets/images/`.
6. Commit and push to GitHub.
7. Publish/update GitHub Pages.
8. Write the client's profile URL to the NFC chip.

## Client editing

Most client work happens in:

```text
clients/client-name/data.js
```

You should not need to touch `index.html`, `script.js`, or `styles.css` for normal client updates.

## Theme system

The default theme is:

`executive-light`

The system is built around:
- white/off-white surfaces
- dark navy typography
- structured sections
- minimal decoration
- subtle borders
- responsive mobile-first design

Client-specific colors can be changed from `data.js` using `theme`.

Built-in themes:
- `executive-light` — recommended default
- `midnight`
- `navy-blue`
- `warm-minimal`

## Optional fields

The profile supports:
- Business logo
- Owner photo
- Owner name
- Designation
- Business name
- Category
- Phone
- WhatsApp
- Email
- Website
- Instagram
- LinkedIn
- Facebook
- Google Maps
- Address
- About
- Services
- Save Contact
- Share Profile

Empty fields are automatically hidden.

## Important NFC concept

Do NOT write all client information onto the NFC chip.

Write only the profile URL.

That lets you update the website later without replacing the NFC card.

## Custom domain later

Once the business grows, you can move from:

https://YOUR-USERNAME.github.io/nfc-profile-system/clients/abc-salon/

to something like:

https://profiles.yourbrand.com/abc-salon/

without changing how the client data is structured.

## Security note

This is a static system. Do not put passwords, payment information, private customer data, API keys, or other secrets in `data.js`.
