import Handlebars from 'handlebars';
import inquirer from 'inquirer';

export enum Transform {
    CAMEL_CASE = 'camelCase',
    CAPITALIZE = 'capitalize',
    KEBAB_CASE = 'kebabCase',
    LOWERCASE = 'lowerCase',
    PASCAL_CASE = 'pascalCase',
    SNAKE_CASE = 'snakeCase',
    UPPERCASE = 'upperCase',
}

// user -> user
export const lowercase = (str: string) => (typeof str === 'string' ? str.toLowerCase() : str);

// user -> USER
export const uppercase = (str: string) => (typeof str === 'string' ? str.toUpperCase() : str);

// userName -> UserName
export const capitalize = (str: string): string =>
    typeof str !== 'string' || !str ? str : str[0].toUpperCase() + str.slice(1);

// user_name -> UserName
// user-name -> UserName
export const pascalCase = (str: string): string => {
    if (!str) return '';

    return (
        str
            // Split camelCase: userPermission → user Permission
            .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
            // Replace separators with spaces
            .replace(/[_\-]+/g, ' ')
            // Normalize case
            .toLowerCase()
            // Capitalize words
            .replace(/\b\w/g, (c) => c.toUpperCase())
            // Remove spaces
            .replace(/\s+/g, '')
    );
};

// user_name -> userName
// user-name -> userName
export const camelCase = (str: string) => {
    const pascal = pascalCase(str);
    return pascal.charAt(0).toLowerCase() + pascal.slice(1);
};

// UserName -> user_name
// userName -> user_name
export const snakeCase = (str: string) =>
    str
        .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
        .replace(/[-\s]+/g, '_')
        .toLowerCase();

// UserName -> user-name
// userName -> user-name
export const kebabCase = (str: string) =>
    str
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

export function getOutputFileName(file: string, artifactName: string): string {
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

export function extractTemplateVariables(source: string): string[] {
    const ast = Handlebars.parse(source);
    const vars = new Set<string>();

    const helpers = new Set(['if', 'each', 'unless', 'with', 'log']);

    function walk(node: any) {
        if (!node) return;

        if (node.type === 'MustacheStatement' || node.type === 'BlockStatement') {
            const name = node.path?.original;
            if (name && !helpers.has(name) && !name.startsWith('@')) {
                vars.add(name.split('.')[0]);
            }
        }

        for (const value of Object.values(node)) {
            if (Array.isArray(value)) value.forEach(walk);
            else if (typeof value === 'object') walk(value);
        }
    }

    walk(ast);
    return [...vars];
}

export async function getAnswers(vars: string[]): Promise<Record<string, any>> {
    return await inquirer.prompt(
        vars.map((name) => ({
            type: 'input',
            name,
            message: `Enter ${name}:`,
        })),
    );
}
