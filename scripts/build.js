// Gera a extensão em dist/antiJequi:
//   1. compila os .ts com esbuild (um bundle por entry point);
//   2. copia os arquivos estáticos (manifest, regras, html, css).
// A pasta gerada pode ser carregada em chrome://extensions ("Carregar sem compactação").
//
// Uso:
//   node scripts/build.js           build de produção (minificado, sem source map)
//   node scripts/build.js --watch   desenvolvimento: recompila ao salvar, com source map
import * as esbuild from "esbuild";
import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const out = join(root, "dist", "antiJequi");
const watch = process.argv.includes("--watch");

// Código TypeScript. A chave é o caminho de saída (sem .js) dentro de dist/antiJequi
// e precisa bater com o que o manifest.json e o popup.html referenciam.
const ENTRIES = {
  background: "src/background.ts",
  content: "src/content.ts",
  "popup/popup": "src/popup/popup.ts",
};

// Arquivos copiados como estão: [origem, destino dentro de dist/antiJequi].
const STATIC = [
  ["manifest.json", "manifest.json"],
  ["rules", "rules"],
  ["src/popup/popup.html", "popup/popup.html"],
  ["src/popup/popup.css", "popup/popup.css"],
  ["LICENSE", "LICENSE"],
];

// Cópia recursiva manual: fs.cpSync recursivo derruba o Node no Windows
// em caminhos com acentos/OneDrive.
function copy(src, dest) {
  if (statSync(src).isDirectory()) {
    mkdirSync(dest, { recursive: true });
    for (const entry of readdirSync(src)) copy(join(src, entry), join(dest, entry));
  } else {
    mkdirSync(dirname(dest), { recursive: true });
    copyFileSync(src, dest);
  }
}

function copyStatic() {
  for (const [src, dest] of STATIC) {
    if (existsSync(join(root, src))) copy(join(root, src), join(out, dest));
  }
}

/** @type {esbuild.BuildOptions} */
const options = {
  absWorkingDir: root,
  entryPoints: ENTRIES,
  outdir: out,
  bundle: true,
  // IIFE: content scripts não aceitam ES modules. Usamos o mesmo formato para
  // todos por simplicidade (o service worker também funciona assim).
  format: "iife",
  target: "chrome120",
  sourcemap: watch ? "inline" : false,
  minify: !watch,
  logLevel: "info",
};

rmSync(join(root, "dist"), { recursive: true, force: true });
mkdirSync(out, { recursive: true });
copyStatic();

if (watch) {
  // Recopia os estáticos a cada rebuild (mudanças em html/css/manifest/regras
  // só são vistas quando algum .ts é salvo — ou reinicie o watch).
  const ctx = await esbuild.context({
    ...options,
    plugins: [{ name: "copy-static", setup: (b) => b.onEnd(copyStatic) }],
  });
  await ctx.watch();
  console.log(`👀 observando mudanças — carregue ${out} no Chrome`);
} else {
  await esbuild.build(options);
  console.log(`✓ build gerado em ${out}`);
}
