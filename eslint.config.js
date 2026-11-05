import js from "@eslint/js";
import globals from "globals";

export default [
  { ignores: ["dist/", "node_modules/"] },
  js.configs.recommended,
  {
    // Código da extensão: roda no navegador, com a API chrome.*
    files: ["*.js", "popup/**/*.js"],
    ignores: ["eslint.config.js", "plopfile.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "script",
      globals: { ...globals.browser, ...globals.webextensions },
    },
  },
  {
    // Módulos do core: rodam no navegador (importados pela extensão)
    files: ["core/src/**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: { ...globals.browser, ...globals.webextensions },
    },
  },
  {
    // Scripts de build, plopfile e testes: rodam no Node
    files: ["scripts/**/*.js", "eslint.config.js", "plopfile.js", "core/test/**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: globals.node,
    },
  },
];
