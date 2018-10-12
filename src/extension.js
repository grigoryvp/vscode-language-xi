const vscode = require('vscode');
const geLinkProvider = require('./get_link_provider.js');
const getEditorChangeHandler = require('./get_editor_change_handler.js');
const getGoBackCmd = require('./get_go_back_cmd.js');
const getOpenCmd = require('./get_open_cmd.js');


module.exports.activate = function(ctx) {
  const HISTORY_KEY = 'file-history';
  const regProvider = vscode.languages.registerDocumentLinkProvider;
  const LinkProvider = geLinkProvider(vscode);
  const onEditorChange = getEditorChangeHandler(ctx, HISTORY_KEY);
  const goBackCmd = getGoBackCmd(vscode, ctx, HISTORY_KEY);
  const openCmd = getOpenCmd(vscode);
  ctx.subscriptions.push(regProvider('xi', new LinkProvider()));
  vscode.window.onDidChangeActiveTextEditor(onEditorChange);
  const regCmd = vscode.commands.registerCommand;
  ctx.subscriptions.push(regCmd('extension.xi.goBack', goBackCmd));
  ctx.subscriptions.push(regCmd('extension.xi.open', openCmd));
}
