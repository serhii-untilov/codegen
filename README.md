# Codegen

Multi-language code generation CLI (TypeScript, Python, ...)

## How to install

Works in any Node project after installing via

``` sh
npm install -D github:serhii-untilov/codegen
```

## How to generate code

Examples:

``` sh
npx codegen
npx codegen --templates ./templates/python.class --name userPermission --output out
npx codegen --templates ./templates/ts.class --name userPermission
```

## How to uninstall

``` sh
npm uninstall codegen
```

## Development

``` sh
npm run build
npm link   # Makes `codegen` globally available
chmod +x dist/index.js
npx codegen
```
