import { test } from "node:test";
import assert from "node:assert/strict";
import { Filters } from "../../src/filters/filters.ts";

test("Filters", () => {
  assert.equal(typeof Filters, "function");
});
