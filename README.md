# Number Rounding Rockstars

A simple Nuxt 3 game where school kids practice rounding numbers to the nearest 10, 100, or 1000. Set your desired time limit and rounding options in the Settings, then race against the clock to answer as many questions correctly as you can!

## Features
- Adjustable time limit (default 3 minutes).
- Choose one or more rounding options (10, 100, 1000).
- Randomly generated questions.
- Immediate feedback and final results screen.
- Game history to track past performance.

# Nuxt 3 Minimal Starter

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install the dependencies:

```bash
# pnpm
pnpm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# pnpm
pnpm run dev
```

## Production

Build the application for production:

```bash
# pnpm
pnpm run build
```

Locally preview production build:

```bash
# pnpm
pnpm run preview
```

## Linting and Formatting

First format with [Prettier](https://prettier.io/), then lint with [ESLint](https://eslint.org/), and finally build with [Vite](https://vitejs.dev/).

```sh
pnpm format && \
pnpm lint && \
pnpm type-check
```

## Deployment

Pushing to the master branch automatically triggers a GitHub Actions workflow to:

1. Install dependencies and build the app.
2. Generate static output in .output/public.
3. Package and upload the static files to the DigitalOcean Droplet.
4. Extract them on the server to complete the deployment.
