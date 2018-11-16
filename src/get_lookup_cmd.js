const tools = require('./tools.js');


module.exports = function(vscode) {
  return async () => {
    const res = await vscode.window.showQuickPick(["not implemented"]);
    tools.debug(res);
  }
}
