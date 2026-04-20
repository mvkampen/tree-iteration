import { build, context } from 'esbuild'

const base = {
  entryPoints: ["src/index.ts", "src/node.ts", "src/zipper.ts"],
  target: "esnext",
  outdir: "dist",
  bundle: true,
  minify: true,
}

const watch = process.argv.includes('--watch')
const targets = [
  { format: 'esm', outExtension: { '.js': '.mjs' } },
  { format: 'cjs', outExtension: { '.js': '.cjs' } }
]

if (watch) {
  const contexts = await Promise.all(
    targets.map(options => context({ ...base, ...options }))
  )

  await Promise.all(contexts.map(buildContext => buildContext.watch()))
  console.log('[esbuild] watching for changes...')
  await new Promise(() => {})
} else {
  await Promise.all(targets.map(options => build({ ...base, ...options })))
}
