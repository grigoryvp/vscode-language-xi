//  Unit test compatibility.
export let _vscode = null;
export let _channel = null;

export const TXT_NO_LOOKUP_PATH = `'xi.lookupPath' config not specified`;
export const TXT_NOT_DIR = `'{0}' is not a directory`;
export const TXT_ERR_READ = `Can't read '{0}'`;


//  Wait some time for VSCode to fully load before using this.
export async function debug(...msgList) {
  if (!this._vscode) this._vscode = await import('vscode');
  if (!this._channel) {
    this._channel = this._vscode.window.createOutputChannel("language-xi");
  }
  this._channel.show();
  this._channel.append(`${msgList.join(", ")}\n`);
}


//  Display error message with interpolation.
export async function error(msg, ...valSeq) {
  if (!this._vscode) this._vscode = await import('vscode');
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
