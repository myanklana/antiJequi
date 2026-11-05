// Valida o manifest e as regras antes do build.
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const errors = [];

function readJson(rel) {
  try {
    return JSON.parse(readFileSync(join(root, rel), "utf8"));
  } catch (e) {
    errors.push(`${rel}: JSON inválido (${e.message})`);
    return null;
  }
}

function mustExist(rel, origin) {
  if (!existsSync(join(root, rel))) errors.push(`${origin}: arquivo não encontrado -> ${rel}`);
}

const manifest = readJson("manifest.json");
const pkg = readJson("package.json");

if (manifest) {
  if (manifest.manifest_version !== 3) errors.push("manifest.json: manifest_version deve ser 3");
  if (pkg && manifest.version !== pkg.version) {
    errors.push(`versão divergente: manifest=${manifest.version} package=${pkg.version}`);
  }

  if (manifest.background?.service_worker) mustExist(manifest.background.service_worker, "background");
  if (manifest.action?.default_popup) mustExist(manifest.action.default_popup, "action");
  for (const cs of manifest.content_scripts ?? []) {
    for (const f of [...(cs.js ?? []), ...(cs.css ?? [])]) mustExist(f, "content_scripts");
  }

  for (const rs of manifest.declarative_net_request?.rule_resources ?? []) {
    mustExist(rs.path, `ruleset ${rs.id}`);
    const rules = existsSync(join(root, rs.path)) ? readJson(rs.path) : null;
    if (!rules) continue;
    if (!Array.isArray(rules)) {
      errors.push(`${rs.path}: deve ser um array`);
      continue;
    }
    const ids = new Set();
    rules.forEach((r, i) => {
      const where = `${rs.path}[${i}]`;
      if (!Number.isInteger(r.id) || r.id < 1) errors.push(`${where}: id deve ser inteiro >= 1`);
      else if (ids.has(r.id)) errors.push(`${where}: id duplicado ${r.id}`);
      else ids.add(r.id);
      if (!r.action?.type) errors.push(`${where}: action.type ausente`);
      if (!r.condition) errors.push(`${where}: condition ausente`);
    });
    console.log(`✓ ${rs.path}: ${rules.length} regras`);
  }
}

if (errors.length) {
  console.error("\nErros de validação:\n- " + errors.join("\n- "));
  process.exit(1);
}
console.log("✓ validação OK");
