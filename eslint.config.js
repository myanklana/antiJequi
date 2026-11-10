import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist/", "node_modules/"] },
  js.configs.recommended,
  {
    // Código da extensão (TypeScript): roda no navegador, com a API chrome.*
    files: ["src/**/*.ts", "core/src/**/*.ts", "core/test/**/*.ts"],
    extends: [tseslint.configs.recommended],
    languageOptions: {
      globals: { ...globals.browser, ...globals.webextensions },
    },
    rules: {
      // Parâmetros/variáveis começando com _ são intencionalmente não usados.
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
    },
  },
  {
    // Módulos do core ainda em JS (migração gradual para .ts)
    files: ["core/src/**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: { ...globals.browser, ...globals.webextensions },
    },
  },
  {
    // Testes: rodam no Node
    files: ["core/test/**/*.ts", "core/test/**/*.js"],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    // Scripts de build, plopfile e configs: rodam no Node
    files: ["scripts/**/*.js", "eslint.config.js", "plopfile.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: globals.node,
    },
  },
);
