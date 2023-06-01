import * as vscode from "vscode";
import { OutlineTreeItem } from "./tree-item";

export class OutlineTreeViewProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
  private readonly _context: vscode.ExtensionContext;
  private readonly _outline: OutlineTreeItem[];

  constructor(context: vscode.ExtensionContext) {
    this._context = context;
    this._outline = this.parseOutline();
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

      const position = new vscode.Position(lines.indexOf(heading), 0);
      const range = document.validateRange(new vscode.Range(position, position.translate(1)));
      const location = new vscode.Location(document.uri, range);

      if (prevLevel < level) {
        acc.at(-1)?.children.push(new OutlineTreeItem(document, heading, location));
      } else {
        acc.push(new OutlineTreeItem(document, heading, location));
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
}
