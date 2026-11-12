# toy-zustand

An npm workspace monorepo scaffold. Requires Node.js 22 or newer.

```text
apps/            Application workspaces
packages/
  store/         Shared package placeholder
    src/
```

Run `npm install` to install and link workspaces.

Add applications under `apps/` and shared packages under `packages/`, each with its own `package.json` and unique package name. The root workspace patterns discover them automatically.
