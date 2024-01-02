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


  it("jumps to anchor", () => {
    const jumpToAnchor = getJumpToAnchor(vscode);
    vscode.window.activeTextEditor.document.getText = () => {
      return `\nfoo .`;
    }
    vscode.window.activeTextEditor.revealRange = (range) => {
      expect(range).deep.includes({begin: 1, end: 1});
    }
    jumpToAnchor('foo');
  });


  it("jumps to self document anchor", () => {
    const jumpToAnchor = getJumpToAnchor(vscode);
    vscode.window.activeTextEditor.document.getText = () => {
      return `\n[foo#]`;
    }
    vscode.window.activeTextEditor.revealRange = (range) => {
      expect(range).deep.includes({begin: 1, end: 1});
    }
    jumpToAnchor('#foo');
  });


  it("jumps to nested anchor", () => {
    const jumpToAnchor = getJumpToAnchor(vscode);
    vscode.window.activeTextEditor.document.getText = () => {
      return `\nfoo .\n  bar .`;
    }
    vscode.window.activeTextEditor.revealRange = (range) => {
      expect(range).deep.includes({begin: 7, end: 7});
    }
    jumpToAnchor('foo#bar');
  });
});
