import * as vscode from "vscode";
import { IconsWebView } from "./view";

export const initializeIconsWebView = async (context: vscode.ExtensionContext) => {
  return [
    vscode.commands.registerCommand("markdown-support.all-icons-viewer", async (args) => {
      await IconsWebView.initialize(context);
    })
  ];
};
