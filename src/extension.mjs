const vscode = require('vscode');
const geLinkProvider = require('./get_link_provider.js');
const getFoldProvider = require('./get_fold_provider.js');
const getEditorChangeHandler = require('./get_editor_change_handler.js');
const getGoBackCmd = require('./get_go_back_cmd.js');
const getOpenCmd = require('./get_open_cmd.js');
const getLookupCmd = require('./get_lookup_cmd.js');


module.exports.activate = function(ctx) {
  const HISTORY_KEY = 'file-history';
  const LinkProvider = geLinkProvider(vscode);
  const FoldProvider = getFoldProvider(vscode);
  const onEditorChange = getEditorChangeHandler(ctx, HISTORY_KEY);
  const goBackCmd = getGoBackCmd(vscode, ctx, HISTORY_KEY);
  const openCmd = getOpenCmd(vscode);
  const lookupCmd = getLookupCmd(vscode);

  vscode.window.onDidChangeActiveTextEditor(onEditorChange);
  const regDocLinkProvider = vscode.languages.registerDocumentLinkProvider;
  ctx.subscriptions.push(regDocLinkProvider('xi', new LinkProvider()));
  const regFoldProvider = vscode.languages.registerFoldingRangeProvider;
  ctx.subscriptions.push(regFoldProvider('xi', new FoldProvider()));
  const regCmd = vscode.commands.registerCommand;
  ctx.subscriptions.push(regCmd('extension.xi.goBack', goBackCmd));
  ctx.subscriptions.push(regCmd('extension.xi.open', openCmd));
  ctx.subscriptions.push(regCmd('extension.xi.lookup', lookupCmd));
}
