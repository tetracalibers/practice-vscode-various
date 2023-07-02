// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { initializeOutlineTreeView } from "./feature/outline-tree-view";
import { initializeIconsWebView } from "./feature/svg-icon-viewer";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(...initializeOutlineTreeView(context));

  const iconsWebView = await initializeIconsWebView(context);
  context.subscriptions.push(...iconsWebView);
}

// This method is called when your extension is deactivated
export function deactivate() {}
