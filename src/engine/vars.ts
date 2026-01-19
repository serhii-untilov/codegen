import chalk from 'chalk';
import { getAnswers } from '../cli/prompts.js';
import { startSpinner, stopSpinner } from '../helpers/spinner.js';
import { extractTemplateVars } from './template.js';

export class Vars {
    constructor(private readonly vars: Record<string, any> = {}) {}

    setVar(key: string, value: any) {
        this.vars[key] = value;
    }

    getVar(key: string): any {
        return this.vars[key];
    }

    getAllVars(): Record<string, any> {
        return { ...this.vars };
    }

    clearVars() {
        for (const key in this.vars) {
            delete this.vars[key];
        }
    }

    getUndefinedVars(templateVars: string[]): string[] {
        return templateVars.filter((v) => !(v in this.vars)).filter((v, i, arr) => arr.indexOf(v) === i);
    }

    addVars(newVars: Record<string, any>) {
        Object.assign(this.vars, newVars);
    }

    async resolveUndefinedVars(templateContent: string, file: string) {
        const undefinedVars = this.getUndefinedVars(extractTemplateVars(templateContent));
        if (undefinedVars.length > 0) {
            stopSpinner();
            console.log(chalk.yellow(`Template ${file} requires additional variables: ${undefinedVars.join(', ')}`));
            const answers = await getAnswers(undefinedVars);
            this.addVars(answers);
            startSpinner('Continuing generation...');
        }
    }
}
