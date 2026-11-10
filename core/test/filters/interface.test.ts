import { test } from "node:test";
import assert from "node:assert/strict";
import { Interface } from "../../src/filters/interface.ts";

test("Interface", () => {
  assert.equal(typeof Interface, "function");
});
