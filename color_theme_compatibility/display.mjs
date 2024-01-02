import chalk from 'chalk';
import theme_default from './dark_defaults.json' assert {type: 'json'};
import theme_vs from './dark_vs.json' assert {type: 'json'};
import theme_plus from './dark_plus.json' assert {type: 'json'};

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
    const partSeq = scope.split('.');
    for (let i = 0; i < partSeq.length; i ++) {
      const part = partSeq[i];
      if (!root.childMap[part]) root.childMap[part] = {childMap: {}};
      root = root.childMap[part];
      if (i === partSeq.length - 1) {
        root.color = token.settings.foreground.toLowerCase();
        colorMap[root.color] = true;
      }
    }
  }
}

function drawScopeRecursive(childMap, offset = 0) {
  for (const [key, val] of Object.entries(childMap)) {
    let str = "";
    for (let i = 0; i < offset; i ++) str += "  ";
    str += key;
    if (val.color) {
      console.log(chalk.bgHex(colorBg).hex(val.color)(str));
    }
    else {
      console.log(chalk.bgHex(colorBg).hex('#888')(str));
    }
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
