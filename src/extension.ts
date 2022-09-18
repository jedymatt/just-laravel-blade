// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { Formatter } from "blade-formatter";
import { TextEncoder } from "util";
import * as vscode from "vscode";

const path = require("path");
const fs = require("fs");

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  console.log("Laravel Blade is now active!");

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "just-laravel-blade.createBladeFile",
      async () => {
        const bladeFileName = await vscode.window.showInputBox({
          prompt: "Enter blade file name using dot notation",
          placeHolder: "example.hello-world",
        });

        if (bladeFileName === "" || bladeFileName === undefined) {
          return;
        }

        if (
          vscode.workspace.workspaceFolders === undefined ||
          vscode.workspace.workspaceFolders.length === 0
        ) {
          return;
        }

        const bladePath = bladeFileName.split(".");

        const workspaceFsPath = vscode.workspace.workspaceFolders[0].uri.fsPath;

        const dirPath = path.join(
          workspaceFsPath,
          "resources/views",
          bladePath.slice(0, bladePath.length - 1).join("/")
        );

        const fileName = `${bladePath[bladePath.length - 1]}.blade.php`;

        const fullFilePath = path.join(dirPath, fileName);

        if (fs.existsSync(fullFilePath)) {
          vscode.window.showErrorMessage(
            "File already exists. Please choose another name."
          );
          return;
        }
        const fileUri = vscode.Uri.file(fullFilePath);

        await vscode.workspace.fs.writeFile(
          fileUri,
          new TextEncoder().encode("")
        );

        vscode.window.showInformationMessage("File is created successfully.");
        console.log("File path: " + fullFilePath + " File URI: " + fileUri);

        vscode.workspace.openTextDocument(fileUri).then((doc) => {
          vscode.window.showTextDocument(doc);
        });
      }
    )
  );

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
