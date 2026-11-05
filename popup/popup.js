const checkbox = document.getElementById("enabled");
const statusEl = document.getElementById("status");
const countEl = document.getElementById("count");

function render({ enabled = true, blockedCount = 0 }) {
  checkbox.checked = enabled;
  statusEl.textContent = enabled ? "Ativo" : "Desativado";
  countEl.textContent = blockedCount;
}

chrome.runtime.sendMessage({ type: "getState" }, render);

checkbox.addEventListener("change", async () => {
  await chrome.runtime.sendMessage({ type: "setEnabled", enabled: checkbox.checked });
  statusEl.textContent = checkbox.checked ? "Ativo" : "Desativado";
});

document.getElementById("reset").addEventListener("click", async () => {
  await chrome.runtime.sendMessage({ type: "resetCount" });
  countEl.textContent = 0;
});

// Atualiza o contador ao vivo enquanto o popup está aberto.
chrome.storage.onChanged.addListener((changes) => {
  if (changes.blockedCount) countEl.textContent = changes.blockedCount.newValue;
});
