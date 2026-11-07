import { test } from "node:test";
import assert from "node:assert/strict";
import { ContentFinderService } from "../../src/service/content-finder-service.js";

test("ContentFinderService", () => {
  assert.equal(typeof ContentFinderService, "function");
});
