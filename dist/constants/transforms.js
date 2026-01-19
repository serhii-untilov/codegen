/**
 * Transform helpers enum
 */
export var Transforms;
(function (Transforms) {
    Transforms["CAMEL_CASE"] = "camelCase";
    Transforms["CAPITALIZE"] = "capitalize";
    Transforms["KEBAB_CASE"] = "kebabCase";
    Transforms["LOWERCASE"] = "lowerCase";
    Transforms["PASCAL_CASE"] = "pascalCase";
    Transforms["SNAKE_CASE"] = "snakeCase";
    Transforms["UPPERCASE"] = "upperCase";
})(Transforms || (Transforms = {}));
/**
 * Handlebars helpers set
 */
export const Helpers = new Set(['if', 'each', 'unless', 'with', 'log', ...Object.values(Transforms)]);
