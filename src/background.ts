// Service worker: guarda o estado (ligado/desligado) e conta bloqueios.

import type { Message, State } from "./messages.ts";

// Todos os rulesets declarados no manifest (gerados por scripts/build-rules-block.ts).
const RULESET_IDS = (chrome.runtime.getManifest().declarative_net_request?.rule_resources ?? [])
  .map((r) => r.id);

chrome.runtime.onInstalled.addListener(async () => {
  const { enabled } = await chrome.storage.local.get("enabled");
  if (enabled === undefined) {
    await chrome.storage.local.set({ enabled: true, blockedCount: 0 });
  }
});

async function setEnabled(enabled: boolean): Promise<void> {
  await chrome.declarativeNetRequest.updateEnabledRulesets(
    enabled
      ? { enableRulesetIds: RULESET_IDS }
      : { disableRulesetIds: RULESET_IDS }
  );
  await chrome.storage.local.set({ enabled });
}

// Contador de bloqueios. onRuleMatchedDebug só funciona com a extensão
// carregada sem compactação (modo desenvolvedor), o que serve para estudar.
if (chrome.declarativeNetRequest.onRuleMatchedDebug) {
  chrome.declarativeNetRequest.onRuleMatchedDebug.addListener(async () => {
    const { blockedCount = 0 } = await chrome.storage.local.get<Partial<State>>("blockedCount");
    await chrome.storage.local.set({ blockedCount: blockedCount + 1 });
  });
}

chrome.runtime.onMessage.addListener((msg: Message, _sender, sendResponse) => {
  switch (msg.type) {
    case "getState":
      chrome.storage.local.get(["enabled", "blockedCount"]).then(sendResponse);
      return true; // resposta assíncrona
    case "setEnabled":
      setEnabled(msg.enabled).then(() => sendResponse({ ok: true }));
      return true;
    case "resetCount":
      chrome.storage.local.set({ blockedCount: 0 }).then(() => sendResponse({ ok: true }));
      return true;
  }
});
