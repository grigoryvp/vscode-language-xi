const chai = require('chai');
const expect = chai.expect;
const getJumpToAnchor = require('./../src/get_jump_to_anchor.js');


describe("jump to anchor", () => {
  const vscode = {
    Range: function(...v) { [this.begin, this.end] = [...v]; },
    Selection: function(...v) { [this.begin, this.end] = [...v]; },
    window: {
      activeTextEditor: {
        document: {
          getText: () => '',
          positionAt: (v) => v,
        },
        revealRange: () => {},
      }
    },
    TextEditorRevealType: {
      InCenter: 1,
    },
  };


  it("gets document from history", () => {
    const jumpToAnchor = getJumpToAnchor(vscode);
    vscode.window.activeTextEditor.document.getText = () => {
      return `\nfoo .`;
    }
    vscode.window.activeTextEditor.revealRange = (range) => {
      expect(range).deep.includes({begin: 1, end: 1});
    }
    jumpToAnchor('foo');
  });
});
