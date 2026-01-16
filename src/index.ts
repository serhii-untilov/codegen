#!/usr/bin/env node
import { Command } from "commander";
import path from "path";
import fs from "fs-extra";
import chalk from "chalk";
import ora from "ora";
import { generate } from "./generator.js";

const program = new Command();

program.name("codegen").description("Multi-language code generation CLI").version("1.0.0");

program
  .option("-t, --templates <folder>", "Templates folder", "./templates/python.class")
  .option("-n, --name <name>", "Name for generated artifact", "Example")
  .option("-o, --output <folder>", "Output folder", "src");

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
    await generate(templatesPath, options.name, options.output);
    spinner.succeed("Generation completed!");
  } catch (err: any) {
    spinner.fail("Generation failed.");
    console.error(err.message);
    process.exit(1);
  }
})();
