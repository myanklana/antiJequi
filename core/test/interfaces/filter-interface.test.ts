import { test } from "node:test";
import assert from "node:assert/strict";
import { FilterInterface } from "../../src/interfaces/filter-interface.ts";

test("FilterInterface", () => {
  assert.equal(typeof FilterInterface, "function");
});
