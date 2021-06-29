import * as path from "path";
import * as env from "jest-environment-node";

export default {
  //   testEnvironment: "./vscode-environment.js",

  moduleDirectories: ["node_modules"],
  modulePaths: ["<rootDir>"],
  //   moduleNameMapper: {
  //     vscode: path.join(__dirname, "test-jest", "vscode.js"), // <----- most important line
  //   },
};
