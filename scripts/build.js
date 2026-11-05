// Copia apenas os arquivos da extensão para dist/antiJequi.
// Essa pasta pode ser carregada em chrome://extensions ("Carregar sem compactação").
import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const out = join(root, "dist", "antiJequi");

// Tudo que vai para dentro da extensão. Adicione aqui novos arquivos/pastas.
const INCLUDE = ["manifest.json", "background.js", "content.js", "popup", "rules", "core/src", "LICENSE"];

// Cópia recursiva manual: fs.cpSync recursivo derruba o Node no Windows
// em caminhos com acentos/OneDrive.
function copy(src, dest) {
  if (statSync(src).isDirectory()) {
    mkdirSync(dest, { recursive: true });
    for (const entry of readdirSync(src)) copy(join(src, entry), join(dest, entry));
  } else {
    copyFileSync(src, dest);
  }
}

rmSync(join(root, "dist"), { recursive: true, force: true });
mkdirSync(out, { recursive: true });

for (const item of INCLUDE) {
  if (existsSync(join(root, item))) copy(join(root, item), join(out, item));
}

console.log(`✓ build gerado em ${out}`);
