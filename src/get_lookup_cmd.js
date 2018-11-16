const tools = require('./tools.js');


module.exports = function(vscode) {
  return function() {
    tools.debug("===== DEBUG =====");
  }
}
