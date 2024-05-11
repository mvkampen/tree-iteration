import { build } from 'esbuild'

const base = {
  entryPoints: ["src/index.ts", "src/node.ts", "src/zipper.ts"],
  target: "esnext",
  outdir: "dist",
  bundle: true,
  minify: true,
}

await build({ ...base, format: 'esm', outExtension: { '.js': '.mjs' } })
await build({ ...base, format: 'cjs', outExtension: { '.js': '.cjs' } })
