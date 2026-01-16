# Codegen

Multi-language code generation CLI (TypeScript, Python, ...)

## How to install

Works in any Node project after installing via

``` sh
npm install github:serhii-untilov/codegen
```

## How to generate

Examples:

``` sh
npx codegen --templates ./templates/ts.class --name userPermission --output out
npx codegen --templates ./templates/python.class --name userPermission --output out
```

## Development

### Build

``` sh
npm run build
npm link   # Makes `codegen` globally available
chmod +x dist/index.js
```
