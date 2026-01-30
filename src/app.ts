#!/usr/bin/env node

/**
 * CLI entry point (bin target)
 */

import chalk from 'chalk';
import { glob } from 'glob';
import { options } from './cli/command.js';
import { Generator } from './engine/generator.js';
import { getTemplatePath } from './fs/reader.js';
import { Writer } from './fs/writer.js';
import { failSpinner, startSpinner, succeedSpinner } from './helpers/spinner.js';
import { registerTransformHelpers } from './helpers/transforms.js';

(async () => {
    try {
        registerTransformHelpers();
        await options.resolve();

        startSpinner('Generating...');
        const templatePath = getTemplatePath(options.templates);
        const templateFiles = await glob('**/*.hbs', { cwd: templatePath });
        console.log(chalk.blue(`Found ${templateFiles.length} template(s) in ${templatePath}`));

        for (const file of templateFiles) {
            const { fileName, meta, content } = await new Generator(options, templatePath, file).run();
            new Writer(options.output).write(fileName, meta, content);
        }

        succeedSpinner('Done');
    } catch (err: any) {
        failSpinner('Generation failed.');
        console.error(chalk.red(err.message));
        process.exit(1);
    }
})();
