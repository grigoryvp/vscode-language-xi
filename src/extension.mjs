import * as vscode from 'vscode';
import getLinkProvider from './get_link_provider.mjs';
import getFoldProvider from './get_fold_provider.mjs';
import getEditorChangeHandler from './get_editor_change_handler.mjs';
import getGoBackCmd from './get_go_back_cmd.mjs';
import getOpenCmd from './get_open_cmd.mjs';
import getLookupCmd from './get_lookup_cmd.mjs';


export function activate(ctx) {
  const HISTORY_KEY = 'file-history';
  const LinkProvider = getLinkProvider(vscode);
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
