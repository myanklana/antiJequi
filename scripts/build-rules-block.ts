// Converte as listas em filters/*.txt (sintaxe EasyList) em rulesets do
// declarativeNetRequest, gravados em <outDir>/rules/rules_N.json.
// Chamado por scripts/build.js, que usa o retorno para montar o
// "declarative_net_request" do manifest.json de dist/.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseNetworkFilter } from "../core/src/filters/network-filters.ts";
import { toDnrRule, type DnrRule } from "../core/src/filters/to-dnr.ts";

const root = fileURLToPath(new URL("..", import.meta.url));
const FILES = ["filters/custom.txt", "filters/easylist.txt"];

// O Chrome garante 30.000 regras estáticas ativas por extensão; acima disso
// usa um pool global compartilhado, que pode não ter espaço. Por isso as
// regras mais importantes vão no primeiro ruleset.
const RULES_PER_RULESET = 30_000;

export interface RuleResource {
  id: string;
  enabled: boolean;
  path: string;
}

export function buildRules(outDir: string): RuleResource[] {
  const rules: DnrRule[] = [];
  const seen = new Set<string>();
  let ignoradas = 0;

  for (const file of FILES) {
    for (const line of readFileSync(join(root, file), "utf8").split(/\r?\n/)) {
      const filter = parseNetworkFilter(line);
      const rule = filter && toDnrRule(filter, 0);
      if (!rule) { ignoradas++; continue; }

      const key = JSON.stringify([rule.action, rule.condition]); // remove duplicadas
      if (seen.has(key)) continue;
      seen.add(key);
      rules.push(rule);
    }
  }

  // Ordem de prioridade: exceções (@@) primeiro, para nunca ficarem de fora;
  // depois regras genéricas (valem em qualquer site); por fim as específicas de domínio.
  const rank = (r: DnrRule) =>
    r.action.type === "allow" ? 0 : r.condition.initiatorDomains ? 2 : 1;
  rules.sort((a, b) => rank(a) - rank(b));
  rules.forEach((r, i) => { r.id = i + 1; });

  mkdirSync(join(outDir, "rules"), { recursive: true });
  const resources: RuleResource[] = [];
  for (let i = 0; i * RULES_PER_RULESET < rules.length; i++) {
    const chunk = rules.slice(i * RULES_PER_RULESET, (i + 1) * RULES_PER_RULESET);
    const path = `rules/rules_${i + 1}.json`;
    writeFileSync(join(outDir, path), JSON.stringify(chunk));
    resources.push({ id: `rules_${i + 1}`, enabled: true, path });
  }

  console.log(`✓ ${rules.length} regras em ${resources.length} ruleset(s) (${ignoradas} linhas ignoradas)`);
  return resources;
}
