import * as vscode from "vscode";
import { SvgCropEditorProvider } from "./provider";

export const initializeOutlineTreeView = (context: vscode.ExtensionContext): vscode.Disposable[] => {
  const provider = new SvgCropEditorProvider(context);

  return [
    vscode.window.registerCustomEditorProvider("svg-cropper", provider, {
      webviewOptions: {
        retainContextWhenHidden: true
      },
      supportsMultipleEditorsPerDocument: false
    })
  ];
};
