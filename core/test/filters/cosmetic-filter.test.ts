import { test } from "node:test";
import assert from "node:assert/strict";
import { CosmeticFilter } from "../../src/filters/cosmetic-filter.ts";

test("CosmeticFilter", () => {
  assert.equal(typeof CosmeticFilter, "function");
});
