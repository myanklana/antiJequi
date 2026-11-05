import { test } from "node:test";
import assert from "node:assert/strict";
import { Engine } from "../../src/engine/engine.js";

test("Engine", () => {
  assert.equal(typeof Engine, "function");
});
