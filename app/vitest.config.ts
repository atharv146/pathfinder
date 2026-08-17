import { defineConfig } from "vitest/config";

/**
 * Test setup — added Aug 17, 2026.
 *
 * WHY NOW: this project had zero automated tests, and two real bugs shipped
 * in a single day that a five-line test would have caught outright:
 *
 *   • `structure.ts` matched "Algebra I" to the "Algebra 2" ladder step,
 *     which would have told a student they'd finished a class they hadn't.
 *   • The unified opportunities list produced duplicate React keys, silently
 *     dropping real programmes from the rendered directory.
 *
 * Both were found by hand, late, by luck. Both are pure functions over pure
 * data — the cheapest possible thing to test. Both now have regression tests.
 *
 * SCOPE, deliberately narrow: pure logic and data integrity only. No DOM, no
 * component rendering, no browser. This project's UI is verified in a real
 * browser, and a wall of brittle render tests would cost more than it catches.
 * What earns its place here is anything where being wrong is *silent* —
 * a bad course match, a stale deadline, a broken URL, a duplicate id.
 *
 * `resolve.tsconfigPaths` is Vite's native `@/...` resolution, so this needs
 * no extra plugin.
 */
export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
