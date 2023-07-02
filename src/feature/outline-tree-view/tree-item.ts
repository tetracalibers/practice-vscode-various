import * as vscode from "vscode";

export class OutlineTreeItem extends vscode.TreeItem {
  readonly children: OutlineTreeItem[] = [];
  public lineNumber: number;

  constructor(document: vscode.TextDocument, heading: string, lineNumber: number) {
    super(heading, vscode.TreeItemCollapsibleState.None);

    this.lineNumber = lineNumber;
    this.label = heading;
    // VSCode のデフォルトの挙動を有効にするのに必要
    this.resourceUri = document.uri;
  }

  expand() {
    this.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
  }
}
