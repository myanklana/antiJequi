import { test } from "node:test";
import assert from "node:assert/strict";
import { ContentFinderService } from "../../src/service/content-finder-service.ts";

test("ContentFinderService", () => {
  assert.equal(typeof ContentFinderService, "function");
});
