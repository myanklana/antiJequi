import { test } from "node:test";
import assert from "node:assert/strict";
import type FilterInterface from "../../src/interfaces/filter-interface.ts";

// Interfaces somem na compilação (não existem em tempo de execução), então
// não dá para testar `typeof FilterInterface`. O que se testa é que um objeto
// com o formato esperado é aceito — o `npm run typecheck` acusa se não for.
test("FilterInterface: objeto com o formato esperado", () => {
  const filter: FilterInterface = {
    mask: 0,
    getId: () => 42,
    getTokens: () => [],
    isCaseSensitive: undefined,
  };

  assert.equal(filter.getId(), 42);
  assert.deepEqual(filter.getTokens(), []);
});
