const tools = require('./tools.js');
const util = require('util');
const path = require('path');
const fs = require('fs');
const os = require('os');
const p = util.promisify;


module.exports = function(vscode) {
  return async () => {
    const cfg = vscode.workspace.getConfiguration('xi');
    let xiDir = cfg.lookupPath;
    //  Something like "~/Documents/PowerShell/xi" on any OS.
    if (!xiDir) {
      return tools.error(tools.TXT_NO_LOOKUP_PATH);
    }
    xiDir = xiDir.replace(/^~/, `${os.homedir()}/`);
    xiDir = xiDir.replace(/\//g, path.sep);
    try {
      const stat = await p(fs.stat)(xiDir);
      if (!stat.isDirectory()) {
        return tools.error(tools.TXT_NOT_DIR, xiDir);
      }
    }
    catch (e) {
      return tools.error(tools.TXT_NOT_DIR, xiDir);
    }

    const res = await vscode.window.showQuickPick(["not implemented"]);
  }
}
