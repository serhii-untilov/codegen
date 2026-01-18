import chalk from 'chalk';
import { getAnswers } from '../cli/prompts.js';
import { startSpinner, stopSpinner } from '../helpers/spinner.js';
import { extractTemplateVars } from './template.js';

const vars: Record<string, any> = {};

export function initVars(newVars: Record<string, any>) {
    clearVars()
    Object.assign(vars, newVars);
}

export function setVar(key: string, value: any) {
    vars[key] = value;
}

export function getVar(key: string): any {
    return vars[key];
}

export function getAllVars(): Record<string, any> {
    return { ...vars };
}

export function clearVars() {
    for (const key in vars) {
        delete vars[key];
    }
}

export function getUndefinedVars(templateVars: string[]): string[] {
    return templateVars.filter((v) => !(v in vars)).filter((v, i, arr) => arr.indexOf(v) === i);
}

export function addVars(newVars: Record<string, any>) {
    Object.assign(vars, newVars);
}

export async function resolveUndefinedVars(templateContent: string, file: string) {
    const undefinedVars = getUndefinedVars(extractTemplateVars(templateContent));
    if (undefinedVars.length > 0) {
        stopSpinner();
        console.log(chalk.yellow(`Template ${file} requires additional variables: ${undefinedVars.join(', ')}`));
        const answers = await getAnswers(undefinedVars);
        addVars(answers);
        startSpinner('Continuing generation...');
    }
}
