import chalk from 'chalk';
import theme_default from './dark_defaults.json';
import theme_vs from './dark_vs.json';
import theme_plus from './dark_plus.json';

const colorBg = theme_default.colors['editor.background'].toLowerCase();
const colorFg = theme_default.colors['editor.foreground'].toLowerCase();
const tokenSeq = [...theme_vs.tokenColors, ...theme_plus.tokenColors];

const scopeTree = {color: '', childMap: {}};
const colorMap = new Set();

for (const token of tokenSeq) {
  if (!token.scope || !token.settings.foreground) continue;
  if (!Array.isArray(token.scope)) token.scope = [token.scope];
  for (const scope of token.scope) {
    let root = scopeTree;
    for (const part of scope.split('.')) {
      if (!root.childMap[part]) root.childMap[part] = {childMap: {}};
      root = root.childMap[part];
      root.color = token.settings.foreground.toLowerCase();
      colorMap[root.color] = true;
    }
  }
}

function drawScopeRecursive(childMap, offset = 0) {
  for (const [key, val] of Object.entries(childMap)) {
    let str = "";
    for (let i = 0; i < offset; i ++) str += "  ";
    str += key;
    console.log(chalk.bgHex(colorBg).hex(val.color)(str));
    drawScopeRecursive(val.childMap, offset + 1);
  }
}

function allScopesForColor(childMap, color, path = []) {
  let res = [];
  for (const [key, val] of Object.entries(childMap)) {
    if (val.color === color) res.push([...path, key].join('.'));
    res.push(...allScopesForColor(val.childMap, color, [...path, key]));
  }
  return res;
}

console.log(`colors: ${Object.keys(colorMap).length}`);
console.log(chalk.bgHex(colorBg).hex(colorFg)(colorFg));
for (const color of Object.keys(colorMap)) {
  const scopeSeq = allScopesForColor(scopeTree.childMap, color);
  const count = String(scopeSeq.length).padEnd(2);
  const scope = scopeSeq.sort()[0];
  let str = `${color} ${count} ${scope}`;
  console.log(chalk.bgHex(colorBg).hex(color)(str));
}
