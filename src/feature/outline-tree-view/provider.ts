import * as vscode from "vscode";
import { OutlineTreeItem } from "./tree-item";

export class OutlineTreeViewProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
  private readonly _context: vscode.ExtensionContext;
  private _outline: OutlineTreeItem[];

  constructor(context: vscode.ExtensionContext) {
    this._context = context;
    this._outline = this.parseOutline();

    vscode.window.onDidChangeTextEditorVisibleRanges((e) => {
      const currentLine = e.visibleRanges[0].start.line;
      this._outline.forEach((treeitem) => {
        treeitem.command = this.onClickItem(currentLine, treeitem);
      });
    });
  }

  private parseOutline() {
    // 見出し一覧を取得する
    const document = vscode.window.activeTextEditor?.document;
    if (document === undefined) {
      return [];
    }

    const markdown = document.getText();
    const lines = markdown.split("\n");
    const headings = lines.filter((line) => line.startsWith("#"));

    let prevLevel: number = 0;

    return headings.reduce<OutlineTreeItem[]>((acc, heading, idx) => {
      const level = heading.match(/^(#+)\s/)?.[1].length ?? 0;

      if (idx === 0) {
        prevLevel = level;
      }

      //const position = new vscode.Position(lines.indexOf(heading), 0);
      //const range = document.validateRange(new vscode.Range(position, position.translate(1)));
      const lineNumber = lines.indexOf(heading);
      const currentLine = vscode.window.activeTextEditor?.visibleRanges[0].start.line ?? 0;

      const treeitem = new OutlineTreeItem(document, heading, lineNumber);
      treeitem.command = this.onClickItem(currentLine, treeitem);

      if (prevLevel < level) {
        acc.at(-1)?.children.push(treeitem);
      } else {
        acc.push(treeitem);
      }

      prevLevel = level;
      return acc;
    }, []);
  }

  getTreeItem(element: OutlineTreeItem): vscode.TreeItem {
    if (element.children.length > 0) {
      element.expand();
    }
    return element;
  }

  getChildren(element?: OutlineTreeItem): vscode.ProviderResult<vscode.TreeItem[]> {
    if (element) {
      return element.children;
    } else {
      return this._outline;
    }
  }

  private onClickItem(currentLine: number, element: OutlineTreeItem): vscode.Command {
    const signedDistance = element.lineNumber - currentLine;
    console.debug(
      `currentLine: ${currentLine}, element.lineNumber: ${element.lineNumber}, signedDistance: ${signedDistance}`
    );
    const direction = signedDistance > 0 ? "down" : "up";
    const distance = Math.abs(signedDistance);

    return {
      command: "editorScroll",
      title: "",
      arguments: [{ to: direction, by: "line", value: distance, revealCursor: true }]
    };
  }
}
