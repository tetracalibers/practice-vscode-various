import * as vscode from "vscode";
import { glob } from "glob";
import * as path from "path";

const getNonce = () => {
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

export class IconsWebView {
  public panel: vscode.WebviewPanel;
  private rootPath: string | undefined;

  private constructor() {
    this.panel = vscode.window.createWebviewPanel("example.webview", "All Icons", vscode.ViewColumn.One, {
      enableScripts: true
    });
    this.rootPath =
      vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0
        ? vscode.workspace.workspaceFolders[0].uri.fsPath
        : undefined;
  }

  static async initialize(context: vscode.ExtensionContext) {
    const view = new IconsWebView();
    view.panel.webview.html = await view.getHtmlForWebView(context, view.panel.webview);
  }

  private async getAllIcons() {
    if (!this.rootPath) {
      return [];
    }

    const svgFiles = await glob("**/*.svg", { cwd: this.rootPath, ignore: ["**/node_modules/**"], absolute: true });

    return svgFiles;
  }

  private async getHtmlForWebView(context: vscode.ExtensionContext, webview: vscode.Webview) {
    const paths = await this.getAllIcons();
    const icons = paths.map((_path) => {
      const src = webview.asWebviewUri(vscode.Uri.file(_path));
      const dir = path.relative(this.rootPath!, _path);
      return { src, path: dir.split(path.sep) };
    });

    const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, "client/style.css"));
    const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, "client/script.js"));
    const nonce = getNonce();

    return `
    <!DOCTYPE html>
    <html lang="ja">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>WebView Example</title>
        <link rel="stylesheet" href="${styleUri}" />
      </head>
      <body>
        <div class="grid">
          ${icons.map((icon) => /* html */ `<button><img alt="${icon.path}" src="${icon.src}" /></button>`).join("")}
        </div>
        <script nonce="${nonce}" src="${scriptUri}"></script>
      </body>
    </html>
    `;
  }
}
