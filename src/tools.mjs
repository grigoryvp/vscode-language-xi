export const TXT_NO_LOOKUP_PATH = `'xi.lookupPath' config not specified`;
export const TXT_NOT_DIR = `'{0}' is not a directory`;
export const TXT_ERR_READ = `Can't read '{0}'`;


//  Wait some time for VSCode to fully load before using this.
export function debug(vscode, ...msgList) {
  if (!this._vscode) {
    this._vscode = vscode;
    this._channel = this._vscode.window.createOutputChannel("language-xi");
  }
  _channel.show();
  _channel.append(`${msgList.join(", ")}\n`);
}


//  Display error message with interpolation.
export function error(vscode, msg, ...valSeq) {
  if (!this._vscode) {
    this._vscode = vscode;
    this._channel = this._vscode.window.createOutputChannel("language-xi");
  }
  //  error("{0} not found", "foo") => "foo not found"
  for (const [i, val] of Object.entries(valSeq)) {
    msg = msg.replace(`{${i}}`, val);
  }
  _channel.append(`${msg}\n`);
  _vscode.window.showErrorMessage(msg);
}
