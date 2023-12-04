{ pkgs }: {
  deps = [
    pkgs.zsh
    pkgs.nodePackages.vscode-langservers-extracted
    pkgs.nodePackages.typescript-language-server  
  ];
}