import * as fs from "fs";
import * as path from "path";
export class Files {
  constructor() {
    var dir = process.cwd().replace(/\\/g, "/");
    var fileList = fs.readdirSync(dir).filter((e) => {
      return e.match(/(_PTH\.DRL|BoardOutline\.GKO|BottomLayer\.GBL)$/gi);
    });
    function get(name) {
      var re = new RegExp(name, "gi");
      var fn = fileList.filter((e) => e.match(re))[0];
      return path.join(dir, fn).replace(/\\/g, "/");
    }
    Object.assign(this, {
      dir: dir,
      files: fileList,
      get: get,
      formatPath: (s) => s.replace(/\\/g, "/"),
    });
  }
}
