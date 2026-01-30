#!/usr/bin/env node
/**
 * CLI entry point (bin target)
 */
import chalk from 'chalk';
import { options } from './cli/command.js';
import { Generator } from './engine/generator.js';
import { failSpinner, startSpinner, succeedSpinner } from './helpers/spinner.js';
import { registerTransformHelpers } from './helpers/transforms.js';
import { getTemplatePath } from './fs/reader.js';
import { glob } from 'glob';
(async () => {
    try {
        registerTransformHelpers();
        await options.resolve();
        startSpinner('Generating...');
        const templatePath = getTemplatePath(options.templates);
        const templateFiles = await glob('**/*.hbs', { cwd: templatePath });
        console.log(chalk.blue(`Found ${templateFiles.length} template(s) in ${templatePath}`));
        for (const file of templateFiles) {
            await new Generator(options, templatePath, file).run();
        }
        succeedSpinner('Done');
    }
    catch (err) {
        failSpinner('Generation failed.');
        console.error(chalk.red(err.message));
        process.exit(1);
    }
})();
