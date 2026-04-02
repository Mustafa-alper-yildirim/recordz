Set WshShell = CreateObject("WScript.Shell")
basePath = CreateObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptFullName)
WshShell.Run Chr(34) & basePath & "\Silva-Backend-Baslat.bat" & Chr(34), 0
