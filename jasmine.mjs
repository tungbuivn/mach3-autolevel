import Jasmine from "jasmine";
import JasmineConsoleReporter from "jasmine-console-reporter";

const jasmine = new Jasmine();
jasmine.loadConfigFile("./spec/support/jasmine.json");

jasmine.env.clearReporters();
jasmine.addReporter(
  new JasmineConsoleReporter({
    colors: true,
    cleanStack: true,
    verbosity: 4,
    listStyle: "indent",
    activity: false,
  })
);

export default jasmine;
