import chalk from 'chalk';
import { getAnswers } from '../cli/prompts.js';
import { startSpinner, stopSpinner } from '../helpers/spinner.js';
import { extractTemplateVars } from './template-reader.js';
export class Context {
    constructor(vars = {}) {
        this.vars = vars;
    }
    setVar(key, value) {
        this.vars[key] = value;
    }
    getVar(key) {
        return this.vars[key];
    }
    getAllVars() {
        return { ...this.vars };
    }
    clearVars() {
        for (const key in this.vars) {
            delete this.vars[key];
        }
    }
    getUndefinedVars(templateVars) {
        return templateVars.filter((v) => !(v in this.vars)).filter((v, i, arr) => arr.indexOf(v) === i);
    }
    addVars(newVars) {
        Object.assign(this.vars, newVars);
    }
    async resolveUndefinedVars(templateContent, file) {
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
