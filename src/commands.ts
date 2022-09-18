import fs from "fs";
import path from "path";
import { TextEncoder } from "util";
import vscode from "vscode";

export async function createBladeFileCommand() {
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

  const workspaceFsPath = vscode.workspace.workspaceFolders[0].uri.fsPath;

  const fullFilePath = getFullFilePathForBlade(bladeFileName, workspaceFsPath);

  if (fs.existsSync(fullFilePath)) {
    vscode.window.showErrorMessage(
      "File already exists. Please choose another name."
    );

    return;
  }

  const fileUri = vscode.Uri.file(fullFilePath);

  await vscode.workspace.fs.writeFile(fileUri, new TextEncoder().encode(""));

  vscode.window.showInformationMessage("File is created successfully.");

  vscode.workspace.openTextDocument(fileUri).then((doc) => {
    vscode.window.showTextDocument(doc);
  });
}

function getFullFilePathForBlade(
  bladeFileName: string,
  workspaceFsPath: string
) {
  const bladePath = bladeFileName.split(".");
  const dirPath = path.join(
    workspaceFsPath,
    "resources/views",
    bladePath.slice(0, bladePath.length - 1).join("/")
  );

  const fileName = `${bladePath[bladePath.length - 1]}.blade.php`;

  return path.join(dirPath, fileName);
}

export const registerCreateBladeFileCommand = vscode.commands.registerCommand(
  "just-laravel-blade.createBladeFile",
  createBladeFileCommand
);
