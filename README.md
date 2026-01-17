# Codegen

Multi-language code generation CLI (TypeScript, Python, ...) by templates.

## Install

Works in any Node project after installing via:

``` sh
npm install -D github:serhii-untilov/codegen
```

## Create a template

Create a `templates` folder in the root of your project.

Create a template file, like a `templates\python.class\name.snakeCase.py.hbs`

``` hbs
class {{pascalCase name}}:
    def __init__(self):
        pass
```

## Generate code

To generate code run:

``` sh
npx codegen --templates ./templates/python.class
```

The generator will prompts you about artifact name, and generates a file `src\{artifact_name}.py`

## How to get help

``` sh
npx codegen --help
npx codegen --version
```

## Development

``` sh
npm run build
npm link   # Makes `codegen` globally available
chmod +x dist/index.js
npx codegen
```
