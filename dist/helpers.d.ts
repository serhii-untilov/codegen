export declare enum Transform {
    CAMEL_CASE = "camelCase",
    CAPITALIZE = "capitalize",
    KEBAB_CASE = "kebabCase",
    LOWERCASE = "lowerCase",
    PASCAL_CASE = "pascalCase",
    SNAKE_CASE = "snakeCase",
    UPPERCASE = "upperCase"
}
export declare const lowercase: (str: string) => string;
export declare const uppercase: (str: string) => string;
export declare const capitalize: (str: string) => string;
export declare const pascalCase: (str: string) => string;
export declare const camelCase: (str: string) => string;
export declare const snakeCase: (str: string) => string;
export declare const kebabCase: (str: string) => string;
/**
 * Register common string helpers for code generation.
 * These helpers are intentionally simple and predictable.
 */
export declare function registerHelpers(): void;
export declare function getOutputFileName(file: string, artifactName: string): string;
