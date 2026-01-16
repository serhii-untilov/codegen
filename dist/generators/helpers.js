import Handlebars from "handlebars";
/**
 * Register common string helpers for code generation.
 * These helpers are intentionally simple and predictable.
 */
export function registerHelpers() {
    // user -> user
    Handlebars.registerHelper("lowercase", (str) => typeof str === "string" ? str.toLowerCase() : str);
    // user -> USER
    Handlebars.registerHelper("uppercase", (str) => typeof str === "string" ? str.toUpperCase() : str);
    // user -> User
    // userName -> UserName
    Handlebars.registerHelper("capitalize", (str) => {
        if (typeof str !== "string" || !str)
            return str;
        return str[0].toUpperCase() + str.slice(1);
    });
    // user_name -> userName
    // user-name -> userName
    Handlebars.registerHelper("camelCase", (str) => {
        if (typeof str !== "string")
            return str;
        return str
            .toLowerCase()
            .replace(/[-_](.)/g, (_, c) => c.toUpperCase());
    });
    // user_name -> UserName
    // user-name -> UserName
    Handlebars.registerHelper("pascalCase", (str) => {
        if (typeof str !== "string")
            return str;
        const camel = str
            .toLowerCase()
            .replace(/[-_](.)/g, (_, c) => c.toUpperCase());
        return camel[0].toUpperCase() + camel.slice(1);
    });
    // UserName -> user_name
    // userName -> user_name
    Handlebars.registerHelper("snake_case", (str) => {
        if (typeof str !== "string")
            return str;
        return str
            .replace(/([A-Z])/g, "_$1")
            .replace(/^_/, "")
            .toLowerCase();
    });
    // UserName -> user-name
    // userName -> user-name
    Handlebars.registerHelper("kebab_case", (str) => {
        if (typeof str !== "string")
            return str;
        return str
            .replace(/([A-Z])/g, "-$1")
            .replace(/^-/, "")
            .toLowerCase();
    });
}
