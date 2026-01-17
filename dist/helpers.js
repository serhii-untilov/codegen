import Handlebars from 'handlebars';
import inquirer from 'inquirer';
export var CustomHelpers;
(function (CustomHelpers) {
    CustomHelpers["CAMEL_CASE"] = "camelCase";
    CustomHelpers["CAPITALIZE"] = "capitalize";
    CustomHelpers["KEBAB_CASE"] = "kebabCase";
    CustomHelpers["LOWERCASE"] = "lowerCase";
    CustomHelpers["PASCAL_CASE"] = "pascalCase";
    CustomHelpers["SNAKE_CASE"] = "snakeCase";
    CustomHelpers["UPPERCASE"] = "upperCase";
})(CustomHelpers || (CustomHelpers = {}));
const helpers = new Set(['if', 'each', 'unless', 'with', 'log', ...Object.values(CustomHelpers)]);
/**
 * Register common string helpers for code generation.
 * These helpers are intentionally simple and predictable.
 */
export function registerHelpers() {
    Handlebars.registerHelper(CustomHelpers.LOWERCASE, lowercase);
    Handlebars.registerHelper(CustomHelpers.UPPERCASE, uppercase);
    Handlebars.registerHelper(CustomHelpers.CAPITALIZE, capitalize);
    Handlebars.registerHelper(CustomHelpers.CAMEL_CASE, camelCase);
    Handlebars.registerHelper(CustomHelpers.PASCAL_CASE, pascalCase);
    Handlebars.registerHelper(CustomHelpers.SNAKE_CASE, snakeCase);
    Handlebars.registerHelper(CustomHelpers.KEBAB_CASE, kebabCase);
}
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
export function getOutputFileName(file, artifactName) {
    // TODO: consider using a more robust templating solution
    return file
        .replace('.hbs', '')
        .replace(`name.${CustomHelpers.LOWERCASE}`, lowercase(artifactName))
        .replace(`name.${CustomHelpers.UPPERCASE}`, uppercase(artifactName))
        .replace(`name.${CustomHelpers.CAPITALIZE}`, capitalize(artifactName))
        .replace(`name.${CustomHelpers.CAMEL_CASE}`, camelCase(artifactName))
        .replace(`name.${CustomHelpers.PASCAL_CASE}`, pascalCase(artifactName))
        .replace(`name.${CustomHelpers.SNAKE_CASE}`, snakeCase(artifactName))
        .replace(`name.${CustomHelpers.KEBAB_CASE}`, kebabCase(artifactName))
        .replace('name', artifactName);
}
export function extractTemplateVariables(source) {
    const ast = Handlebars.parse(source);
    const vars = new Set();
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
    return templateVariables.filter((v) => !(v in providedVars)).filter((v, i, arr) => arr.indexOf(v) === i);
}
export async function resolveName(name) {
    if (name !== '?') {
        return name;
    }
    const { artifactName } = await inquirer.prompt([
        {
            type: 'input',
            name: 'artifactName',
            message: 'Enter name for generated artifact:',
            validate: (input) => input.trim().length > 0 || 'Name cannot be empty',
        },
    ]);
    return artifactName;
}
export async function resolveOutputFolder(name) {
    if (name !== '?') {
        return name;
    }
    const { outputFolderName } = await inquirer.prompt([
        {
            type: 'input',
            name: 'outputFolderName',
            message: 'Enter name for the output folder name:',
            validate: (input) => input.trim().length > 0 || 'Folder name cannot be empty',
        },
    ]);
    return outputFolderName;
}
