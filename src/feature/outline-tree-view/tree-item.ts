import * as vscode from "vscode";

export class OutlineTreeItem extends vscode.TreeItem {
  readonly children: OutlineTreeItem[] = [];

  constructor(document: vscode.TextDocument, heading: string, location: vscode.Location) {
    super(heading, vscode.TreeItemCollapsibleState.None);

    // VSCode のデフォルトの挙動を有効にするのに必要
    this.resourceUri = document.uri;

    this.command = {
      command: "markdown-outline-treeview.revealLine",
      title: "move to line",
      arguments: [location]
    };
  }

  expand() {
    this.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
  }
}
