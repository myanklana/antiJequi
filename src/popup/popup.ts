import type { Message, State } from "../messages.ts";

// Busca um elemento pelo id e falha cedo se o HTML mudar.
function byId<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`popup.html: elemento #${id} não encontrado`);
  return el as T;
}

const checkbox = byId<HTMLInputElement>("enabled");
const statusEl = byId("status");
const countEl = byId("count");

function send<R = unknown>(msg: Message): Promise<R> {
  return chrome.runtime.sendMessage<Message, R>(msg);
}

function render({ enabled = true, blockedCount = 0 }: Partial<State>): void {
  checkbox.checked = enabled;
  statusEl.textContent = enabled ? "Ativo" : "Desativado";
  countEl.textContent = String(blockedCount);
}

send<Partial<State>>({ type: "getState" }).then(render);

checkbox.addEventListener("change", async () => {
  await send({ type: "setEnabled", enabled: checkbox.checked });
  statusEl.textContent = checkbox.checked ? "Ativo" : "Desativado";
});

byId("reset").addEventListener("click", async () => {
  await send({ type: "resetCount" });
  countEl.textContent = "0";
});

// Atualiza o contador ao vivo enquanto o popup está aberto.
chrome.storage.onChanged.addListener((changes) => {
  if (changes.blockedCount) countEl.textContent = String(changes.blockedCount.newValue);
});
