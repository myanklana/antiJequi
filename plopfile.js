const SRC = "core/src";
const TEST = "core/test";

const required = (label) => (value) => value.trim() !== "" || `${label} é obrigatório`;

const namePrompt = (kind) => ({
  type: "input",
  name: "name",
  message: `nome do ${kind}:`,
  validate: required("nome"),
});

// Gera um arquivo em core/src e o teste correspondente em core/test.
const withTest = (dir, template) => [
  {
    type: "add",
    path: `${SRC}/${dir}{{kebabCase name}}.js`,
    templateFile: `plop-templates/${template}.hbs`,
  },
  {
    type: "add",
    path: `${TEST}/${dir}{{kebabCase name}}.test.js`,
    templateFile: `plop-templates/${template}-test.hbs`,
  },
];

export default function (plop) {
  // Caminho relativo do teste até a raiz de core/, para o import no template.
  // Ex.: "" -> "../", "filters/net" -> "../../../"
  plop.setHelper("up", (path = "") =>
    "../".repeat(path.split("/").filter(Boolean).length + 1),
  );

  plop.setGenerator("module", {
    description: "módulo em core/src + teste em core/test",
    prompts: [namePrompt("módulo")],
    actions: withTest("", "module"),
  });

  plop.setGenerator("controller", {
    description: "application controller logic",
    prompts: [namePrompt("controller")],
    actions: [
      {
        type: "add",
        path: `${SRC}/{{kebabCase name}}.js`,
        templateFile: "plop-templates/controller.hbs",
      },
    ],
  });

  plop.setGenerator("service", {
    description: "application service logic",
    prompts: [namePrompt("service")],
    actions: withTest("", "service"),
  });

  plop.setGenerator("component", {
    description: "application component logic",
    prompts: [
      namePrompt("component"),
      {
        type: "input",
        name: "path",
        message: "subpasta (ex.: filters/net, vazio = direto em src):",
        // "" fica "", "/filters/net/" vira "filters/net/" (com uma barra no fim)
        filter: (value) => {
          const dir = value.trim().replace(/^\/+|\/+$/g, "");
          return dir ? `${dir}/` : "";
        },
      },
    ],
    actions: withTest("{{path}}", "component"),
  });
}
