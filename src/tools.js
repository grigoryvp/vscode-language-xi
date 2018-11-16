module.exports = {
  //  Unit test compatibility.
  _vscode: null,

  //  Wait some time for VSCode to fully load before using this.
  debug: (msg) => {
    if (!this._vscode) this._vscode = require('vscode');
    this._vscode.debug.activeDebugConsole.appendLine(msg);
  }
};
