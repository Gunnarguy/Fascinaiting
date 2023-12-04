{ pkgs }: {
  deps = [
    pkgs.glibcLocales
    pkgs.glibc
    pkgs.nano
    pkgs.zsh
    pkgs.nodePackages.vscode-langservers-extracted
    pkgs.nodePackages.typescript-language-server  
  ];
  env = {
    PYTHON_LD_LIBRARY_PATH = pkgs.lib.makeLibraryPath [
      pkgs.glibcLocales
    ];
  };
}