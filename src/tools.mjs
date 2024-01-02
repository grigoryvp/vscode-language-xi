module.exports = {
  //  Unit test compatibility.
  _vscode: null,
  _channel: null,

  TXT_NO_LOOKUP_PATH: `'xi.lookupPath' configuration not specified`,
  TXT_NOT_DIR: `'{0}' is not a directory`,
  TXT_ERR_READ: `Can't read '{0}'`,

  //  Wait some time for VSCode to fully load before using this.
  debug: (...msgList) => {
    if (!this._vscode) this._vscode = require('vscode');
    if (!this._channel) {
      this._channel = this._vscode.window.createOutputChannel("language-xi");
    }
    this._channel.show();
    this._channel.append(`${msgList.join(", ")}\n`);
  },

  //  Display error message with interpolation.
  error: (msg, ...valSeq) => {
    if (!this._vscode) this._vscode = require('vscode');
    if (!this._channel) {
      this._channel = this._vscode.window.createOutputChannel("language-xi");
    }
    //  error("{0} not found", "foo") => "foo not found"
    for (const [i, val] of Object.entries(valSeq)) {
      msg = msg.replace(`{${i}}`, val);
    }
    this._channel.append(`${msg}\n`);
    this._vscode.window.showErrorMessage(msg);
  }
};
