import Handlebars from 'handlebars';
import inquirer from 'inquirer';
export var Transform;
(function (Transform) {
    Transform["CAMEL_CASE"] = "camelCase";
    Transform["CAPITALIZE"] = "capitalize";
    Transform["KEBAB_CASE"] = "kebabCase";
    Transform["LOWERCASE"] = "lowerCase";
    Transform["PASCAL_CASE"] = "pascalCase";
    Transform["SNAKE_CASE"] = "snakeCase";
    Transform["UPPERCASE"] = "upperCase";
})(Transform || (Transform = {}));
// user -> user
export const lowercase = (str) => (typeof str === 'string' ? str.toLowerCase() : str);
// user -> USER
export const uppercase = (str) => (typeof str === 'string' ? str.toUpperCase() : str);
// userName -> UserName
export const capitalize = (str) => typeof str !== 'string' || !str ? str : str[0].toUpperCase() + str.slice(1);
// user_name -> UserName
// user-name -> UserName
export const pascalCase = (str) => {
    if (!str)
        return '';
    return (str
        // Split camelCase: userPermission → user Permission
        .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
        // Replace separators with spaces
        .replace(/[_\-]+/g, ' ')
        // Normalize case
        .toLowerCase()
        // Capitalize words
        .replace(/\b\w/g, (c) => c.toUpperCase())
        // Remove spaces
        .replace(/\s+/g, ''));
};
// user_name -> userName
// user-name -> userName
export const camelCase = (str) => {
    const pascal = pascalCase(str);
    return pascal.charAt(0).toLowerCase() + pascal.slice(1);
};
// UserName -> user_name
// userName -> user_name
export const snakeCase = (str) => str
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/[-\s]+/g, '_')
    .toLowerCase();
// UserName -> user-name
// userName -> user-name
export const kebabCase = (str) => str
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[_\s]+/g, '-')
    .toLowerCase();
/**
 * Register common string helpers for code generation.
 * These helpers are intentionally simple and predictable.
 */
export function registerHelpers() {
    Handlebars.registerHelper(Transform.LOWERCASE, lowercase);
    Handlebars.registerHelper(Transform.UPPERCASE, uppercase);
    Handlebars.registerHelper(Transform.CAPITALIZE, capitalize);
    Handlebars.registerHelper(Transform.CAMEL_CASE, camelCase);
    Handlebars.registerHelper(Transform.PASCAL_CASE, pascalCase);
    Handlebars.registerHelper(Transform.SNAKE_CASE, snakeCase);
    Handlebars.registerHelper(Transform.KEBAB_CASE, kebabCase);
}
export function getOutputFileName(file, artifactName) {
    // TODO: consider using a more robust templating solution
    return file
        .replace('.hbs', '')
        .replace(`name.${Transform.LOWERCASE}`, lowercase(artifactName))
        .replace(`name.${Transform.UPPERCASE}`, uppercase(artifactName))
        .replace(`name.${Transform.CAPITALIZE}`, capitalize(artifactName))
        .replace(`name.${Transform.CAMEL_CASE}`, camelCase(artifactName))
        .replace(`name.${Transform.PASCAL_CASE}`, pascalCase(artifactName))
        .replace(`name.${Transform.SNAKE_CASE}`, snakeCase(artifactName))
        .replace(`name.${Transform.KEBAB_CASE}`, kebabCase(artifactName))
        .replace('name', artifactName);
}
export function extractTemplateVariables(source) {
    const ast = Handlebars.parse(source);
    const vars = new Set();
    const helpers = new Set(['if', 'each', 'unless', 'with', 'log']);
    function walk(node) {
        if (!node)
            return;
        if (node.type === 'MustacheStatement' || node.type === 'BlockStatement') {
            const name = node.path?.original;
            if (name && !helpers.has(name) && !name.startsWith('@')) {
                vars.add(name.split('.')[0]);
            }
        }
        for (const value of Object.values(node)) {
            if (Array.isArray(value))
                value.forEach(walk);
            else if (typeof value === 'object')
                walk(value);
        }
    }
    walk(ast);
    return [...vars];
}
export async function getAnswers(vars) {
    return await inquirer.prompt(vars.map((name) => ({
        type: 'input',
        name,
        message: `Enter ${name}:`,
    })));
}
export function getUndefinedTemplateVariables(templateContent, providedVars) {
    const templateVariables = extractTemplateVariables(templateContent);
    const transformSet = new Set(Object.values(Transform));
    return templateVariables
        .filter((v) => !(v in providedVars))
        .filter((v, i, arr) => arr.indexOf(v) === i)
        .filter((v) => !transformSet.has(v));
}
