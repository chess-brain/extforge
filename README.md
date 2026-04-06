# CB-ExtGallary

A svelte-powered app to make extensions for PenguinMod with blockly

## Developing

Once you've created a project and installed dependencies with `npm install -f` (or `pnpm install -f` or `yarn -f`), start a development server: <!-- npm needs -f or the packages wont install but do pnpm or yarn allow it? idk i dont use them -->

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
