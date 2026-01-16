import Handlebars from "handlebars";

export function registerHelpers() {
  Handlebars.registerHelper("lowercase", (str: string) => str.toLowerCase());
  Handlebars.registerHelper("uppercase", (str: string) => str.toUpperCase());
  Handlebars.registerHelper("snake_case", (str: string) =>
    str.replace(/[A-Z]/g, (m) => "_" + m.toLowerCase()).replace(/^_/, "")
  );
  Handlebars.registerHelper("kebab_case", (str: string) =>
    str.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase()).replace(/^-/, "")
  );
}
