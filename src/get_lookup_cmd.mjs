import * as process from 'process';
import * as util from 'util';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import * as tools from './tools.mjs';
const p = util.promisify;


export default function getLookupCmd(vscode) {
  return async () => {
    const cfg = vscode.workspace.getConfiguration('xi');
    let xiDir = cfg.lookupPath;
    //  Something like "~/Documents/PowerShell/xi" on any OS.
    if (!xiDir) {
      return tools.error(tools.TXT_NO_LOOKUP_PATH);
    }
    xiDir = xiDir.replace(/^~/, `${os.homedir()}/`);
    xiDir = xiDir.replace(/[\/\\]/g, path.sep);
    xiDir = xiDir.replace(/\${env:([^}]*)}/g, (match, p1) => {
      return process.env[p1] || ""
    });
    try {
      const stat = await p(fs.stat)(xiDir);
      if (!stat.isDirectory()) {
        return tools.error(tools.TXT_NOT_DIR, xiDir);
      }
    }
    catch (e) {
      return tools.error(tools.TXT_NOT_DIR, xiDir);
    }

    let nameSeq = [];
    try {
      nameSeq = await p(fs.readdir)(xiDir);
    }
    catch (e) {
      return tools.error(tools.TXT_ERR_READ, xiDir);
    }

    nameSeq = nameSeq.filter(v => {
      if (v === '.git') return false;
      return true;
    });
    if (!nameSeq.length) return;

    const name = await vscode.window.showQuickPick(nameSeq);
    if (!name) return;

    const uri = vscode.Uri.file(path.join(xiDir, name));
    try {
      const doc = await vscode.workspace.openTextDocument(uri);
      await vscode.window.showTextDocument(doc);
    }
    catch (e) {
    }
  }
}
