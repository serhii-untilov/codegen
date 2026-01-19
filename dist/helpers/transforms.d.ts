/**
 * camelCase, pascalCase, etc.
 */
/**
 * Register common string helpers for code generation.
 * These helpers are intentionally simple and predictable.
 */
export declare function registerTransformHelpers(): void;
export declare const lowercase: (str: string) => string;
export declare const uppercase: (str: string) => string;
export declare const capitalize: (str: string) => string;
export declare const pascalCase: (str: string) => string;
export declare const camelCase: (str: string) => string;
export declare const snakeCase: (str: string) => string;
export declare const kebabCase: (str: string) => string;
