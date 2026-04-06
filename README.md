# CB-ExtGallary

<div align="center">

[![GitHub issues](https://img.shields.io/github/issues/chess-brain/CB-ExtGallary)](https://github.com/chess-brain/CB-ExtGallary/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/chess-brain/CB-ExtGallary)](https://github.com/chess-brain/CB-ExtGallary/pulls)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.0-4baaaa.svg)](CODE_OF_CONDUCT.md)
[![npm version](https://img.shields.io/npm/v/@voltagent/core.svg)](https://www.npmjs.com/package/@voltagent/core)
[![npm downloads](https://img.shields.io/npm/dm/@voltagent/core.svg)](https://www.npmjs.com/package/@voltagent/core)
</div>

## Introduce

This is a fork from jwklong/extforge
A svelte-powered app to make extensions with blockly, now able for:
- Turbowarp
- PenguinMod
- 02Engine
- Mistium

## Developing

Once you've created a project and installed dependencies with `npm install -f` (or `pnpm install -f` or `yarn -f`), start a development server: (npm needs -f or the packages wont install but do pnpm or yarn allow it? idk i dont use them)
```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
