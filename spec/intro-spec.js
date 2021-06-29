import jasmine from "../jasmine.mjs";
// import JasmineConsoleReporter from "jasmine-console-reporter";
jasmine.env.describe("Foo", () => {
  jasmine.env.it("Bar", () => {
    // Expects, assertions...
    expect(1 + 2).toBe(3);
  });
});
