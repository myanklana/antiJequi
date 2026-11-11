import { test } from "node:test";
import assert from "node:assert/strict";
import { NetworkFilter } from "../../src/filters/network-filter.ts";

test("NetworkFilter", () => {
  assert.equal(typeof NetworkFilter, "function");
});
