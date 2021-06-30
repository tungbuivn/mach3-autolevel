// import * as path from "path";
// import env from "jest-environment-node";

export default {
  // testEnvironment: "./vscode-environment.mjs",
  //testEnvironment: "node",
  moduleDirectories: ["./node_modules"],
  modulePaths: ["<rootDir>"],
  transform: {
    "\\.[jt]sx?$": "babel-jest",
  },

  //   moduleNameMapper: {
  //     vscode: path.join(__dirname, "test-jest", "vscode.js"), // <----- most important line
  //   },
};
