// Formato das mensagens trocadas entre popup/content script e o background.
// Adicione um novo membro à união para cada novo tipo de mensagem.

export type Message =
  | { type: "getState" }
  | { type: "setEnabled"; enabled: boolean }
  | { type: "resetCount" };

// O que fica salvo em chrome.storage.local.
export interface State {
  enabled: boolean;
  blockedCount: number;
}
