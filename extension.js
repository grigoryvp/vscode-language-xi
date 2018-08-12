const vscode = require('vscode');
const geLinkProvider = require('./get_link_provider.js');


module.exports.activate = function(ctx) {
  const reg = vscode.languages.registerDocumentLinkProvider;
  const LinkProvider = geLinkProvider(vscode);
  ctx.subscriptions.push(reg('xi', new LinkProvider()));
}
