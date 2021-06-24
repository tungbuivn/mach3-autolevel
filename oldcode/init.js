var fs = require("fs");

var path = require("path");
var bottle = new require("bottlejs")();
bottle.service("Files", function () {
  var dir = process.cwd().replace(/\\/g, "/");
  var fileList = fs.readdirSync(dir).filter((e) => {
    return e.match(/(_PTH\.DRL|BoardOutline\.GKO|BottomLayer\.GBL)$/gi);
  });
  function get(name) {
    var re = new RegExp(name, "gi");
    var fn = fileList.filter((e) => e.match(re))[0];
    return path.join(dir, fn).replace(/\\/g, "/");
  }
  return {
    dir: dir,
    files: fileList,
    get: get,
    formatPath: (s) => s.replace(/\\/g, "/"),
  };
});
bottle.service("config", require("./config"));
bottle.factory("hole", require("../gerber/hole"));
bottle.factory("Gerber", require("../gerber/gerber"));
/**
 * @type {import("docs").IContainer}
 */
var exp = bottle.container;

module.exports = exp;
