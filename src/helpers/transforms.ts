/**
 * camelCase, pascalCase, etc.
 */

import Handlebars from 'handlebars';
import { Transforms } from '../constants/transforms.js';

/**
 * Register common string helpers for code generation.
 * These helpers are intentionally simple and predictable.
 */
export function registerTransformHelpers() {
    Handlebars.registerHelper(Transforms.LOWERCASE, lowercase);
    Handlebars.registerHelper(Transforms.UPPERCASE, uppercase);
    Handlebars.registerHelper(Transforms.CAPITALIZE, capitalize);
    Handlebars.registerHelper(Transforms.CAMEL_CASE, camelCase);
    Handlebars.registerHelper(Transforms.PASCAL_CASE, pascalCase);
    Handlebars.registerHelper(Transforms.SNAKE_CASE, snakeCase);
    Handlebars.registerHelper(Transforms.KEBAB_CASE, kebabCase);
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
