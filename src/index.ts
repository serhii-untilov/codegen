#!/usr/bin/env node

import { Command } from "commander";
import path from "path";
import fs from "fs-extra";
import chalk from "chalk";
import ora from "ora";
import { generateTSClass } from "./generators/ts-class.js";
import { generatePythonClass } from "./generators/python-class.js";

const program = new Command();

program
  .name("codegen")
  .description("Multi-language code generation CLI")
  .version("0.1.0");

program
  .option("-t, --templates <folder>", "Path to templates folder", "./templates")
  .option("-g, --generate <type>", "What to generate (ts-class, python-class)")
  .option("-n, --name <name>", "Name of the artifact", "Example");

program.parse(process.argv);
const options = program.opts();

const templatesPath = path.resolve(options.templates);
if (!fs.existsSync(templatesPath)) {
  console.error(chalk.red(`Templates folder not found: ${templatesPath}`));
  process.exit(1);
}

(async () => {
  const spinner = ora("Generating...").start();

  try {
    switch (options.generate) {
      case "ts-class":
        await generateTSClass(templatesPath, options.name);
        break;
      case "python-class":
        await generatePythonClass(templatesPath, options.name);
        break;
      default:
        console.log(chalk.yellow("Unknown generator type."));
        process.exit(1);
    }

    spinner.succeed("Generation completed!");
  } catch (err: any) {
    spinner.fail("Generation failed.");
    console.error(err.message);
    process.exit(1);
  }
})();
