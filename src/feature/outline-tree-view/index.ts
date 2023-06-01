import * as vscode from "vscode";
import { OutlineTreeViewProvider } from "./provider";

export const initializeOutlineTreeView = (context: vscode.ExtensionContext): vscode.Disposable[] => {
  const provider = new OutlineTreeViewProvider(context);

  return [
    vscode.window.createTreeView("markdown-outline-treeview", {
      treeDataProvider: provider
    })
  ];
};
