module.exports = {
  //  Unit test compatibility.
  _vscode: null,

  TXT_NO_LOOKUP_PATH: `'xi.lookupPath' configuration not specified`,
  TXT_NOT_DIR: `'{0}' is not a directory`,
  TXT_ERR_READ: `Can't read '{0}'`,

  //  Wait some time for VSCode to fully load before using this.
  debug: (msg) => {
    if (!this._vscode) this._vscode = require('vscode');
    this._vscode.debug.activeDebugConsole.appendLine(msg);
  },

  //  Display error message with interpolation.
  error: (msg, ...valSeq) => {
    if (!this._vscode) this._vscode = require('vscode');
    //  error("{0} not found", "foo") => "foo not found"
    for (const [i, val] of Object.entries(valSeq)) {
      msg = msg.replace(`{${i}}`, val);
    }
    this._vscode.window.showErrorMessage(msg);
  }
};
