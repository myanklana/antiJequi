import { test } from "node:test";
import assert from "node:assert/strict";
import { Conteudo } from "../../src/engine/conteudo.ts";

test("Conteudo", () => {
  assert.equal(typeof Conteudo, "function");
});
