import { test } from "node:test";
import assert from "node:assert/strict";
import { parseNetworkFilter } from "../../src/filters/network-filters.ts";
import { toDnrRule } from "../../src/filters/to-dnr.ts";

const convert = (line: string) => {
  const f = parseNetworkFilter(line);
  return f && toDnrRule(f, 1);
};

test("ignora vazio, comentário, header e cosmético", () => {
  for (const line of ["", "! comentário", "[Adblock Plus 2.0]", "##.banner", "###AD_300", "site.com##.ad", "site.com#@#.ad", "site.com#?#div:has(.ad)"]) {
    assert.equal(parseNetworkFilter(line), null, line);
  }
});

test("bloqueio com tipos e third-party", () => {
  assert.deepEqual(convert("||ads.com^$script,third-party"), {
    id: 1,
    priority: 1,
    action: { type: "block" },
    condition: { urlFilter: "||ads.com^", resourceTypes: ["script"], domainType: "thirdParty" },
  });
});

test("~third-party vira firstParty", () => {
  assert.equal(convert("/ad.js$~third-party")?.condition.domainType, "firstParty");
});

test("exceção @@ vira allow com prioridade maior", () => {
  const r = convert("@@||site.com/ad.js");
  assert.equal(r?.action.type, "allow");
  assert.equal(r?.priority, 2);
});

test("$important vence exceção", () => {
  assert.equal(convert("||ads.com^$important")?.priority, 11);
});

test("domain= separa incluídos e excluídos", () => {
  assert.deepEqual(convert("/banner/*$domain=a.com|~b.com")?.condition, {
    urlFilter: "/banner/*",
    initiatorDomains: ["a.com"],
    excludedInitiatorDomains: ["b.com"],
  });
});

test("tipos negados viram excludedResourceTypes", () => {
  assert.deepEqual(convert("||ads.com^$~image")?.condition.excludedResourceTypes, ["image"]);
});

test("resourceTypes e excludedResourceTypes nunca saem juntos", () => {
  const c = convert("||ads.com^$script,~image")?.condition;
  assert.deepEqual(c?.resourceTypes, ["script"]);
  assert.equal(c?.excludedResourceTypes, undefined);
});

test("match-case vira isUrlFilterCaseSensitive", () => {
  assert.equal(convert("/Ads/banner$match-case")?.condition.isUrlFilterCaseSensitive, true);
});

test("ignora regex, opções não suportadas e padrões não-ASCII", () => {
  assert.equal(convert("/ads[0-9]+/"), null);
  assert.equal(convert("||ads.com^$popup"), null);
  assert.equal(convert("||anúncio.com^"), null);
});

test("nunca gera regra que bloqueia tudo", () => {
  assert.equal(convert("$third-party"), null);
  assert.equal(convert("*$script"), null);
});
