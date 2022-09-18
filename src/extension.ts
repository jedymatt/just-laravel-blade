// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { Formatter } from "blade-formatter";
import vscode from "vscode";

import { registerCreateBladeFileCommand } from "./commands";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  console.log("Laravel Blade is now active!");

  context.subscriptions.push(registerCreateBladeFileCommand);

  context.subscriptions.push(
    vscode.languages.registerDocumentFormattingEditProvider("blade", {
      provideDocumentFormattingEdits(document: vscode.TextDocument) {
        const lastLine = document.lineAt(document.lineCount - 1);
        const range = new vscode.Range(
          new vscode.Position(0, 0),
          lastLine.range.end
        );

        const options = {
          indentSize: 4,
          sortTailwindcssClasses: true,
          noMultipleEmptyLines: true,
          sortHtmlAttributes: "code-guide",
          endWithNewLine: true,
          wrapAttributes: "force-expand-multiline",
        };

        return new Formatter(options)
          .formatContent(document.getText())
          .then((formattedText: string) => {
            return [new vscode.TextEdit(range, formattedText)];
          })
          .catch((error: Error) => {
            vscode.window.showErrorMessage(error.message);
            return [];
          });
      },
    })
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}
