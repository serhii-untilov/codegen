/**
 * Transform helpers enum
 */

export enum Transforms {
    CAMEL_CASE = 'camelCase',
    CAPITALIZE = 'capitalize',
    KEBAB_CASE = 'kebabCase',
    LOWERCASE = 'lowerCase',
    PASCAL_CASE = 'pascalCase',
    SNAKE_CASE = 'snakeCase',
    UPPERCASE = 'upperCase',
}

/**
 * Handlebars helpers set
 */

export const Helpers = new Set(['if', 'each', 'unless', 'with', 'log', ...Object.values(Transforms)]);
