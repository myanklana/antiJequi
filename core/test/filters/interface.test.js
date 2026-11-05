import { test } from "node:test";
import assert from "node:assert/strict";
import { Interface } from "../../src/filters/interface.js";

test("Interface", () => {
  assert.equal(typeof Interface, "function");
});
