import Handlebars from 'handlebars';
import inquirer from 'inquirer';

export enum CustomHelpers {
    CAMEL_CASE = 'camelCase',
    CAPITALIZE = 'capitalize',
    KEBAB_CASE = 'kebabCase',
    LOWERCASE = 'lowerCase',
    PASCAL_CASE = 'pascalCase',
    SNAKE_CASE = 'snakeCase',
    UPPERCASE = 'upperCase',
}

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

export function getOutputFileName(file: string, artifactName: string): string {
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

export function extractTemplateVariables(source: string): string[] {
    const ast = Handlebars.parse(source);
    const vars = new Set<string>();

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

export function getUndefinedTemplateVariables(templateContent: string, providedVars: Record<string, any>): string[] {
    const templateVariables = extractTemplateVariables(templateContent);
    return templateVariables.filter((v) => !(v in providedVars)).filter((v, i, arr) => arr.indexOf(v) === i);
}

export async function resolveName(name: string): Promise<string> {
    if (name !== '?') {
        return name;
    }

    const { artifactName } = await inquirer.prompt([
        {
            type: 'input',
            name: 'artifactName',
            message: 'Enter name for generated artifact:',
            validate: (input: string) => input.trim().length > 0 || 'Name cannot be empty',
        },
    ]);

    return artifactName;
}

export async function resolveOutputFolder(name: string): Promise<string> {
    if (name !== '?') {
        return name;
    }

    const { outputFolderName } = await inquirer.prompt([
        {
            type: 'input',
            name: 'outputFolderName',
            message: 'Enter name for the output folder name:',
            validate: (input: string) => input.trim().length > 0 || 'Folder name cannot be empty',
        },
    ]);

    return outputFolderName;
}
