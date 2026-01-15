# Codegen

Works in any Node project after installing via

``` sh
npm install github:serhii-untilov/codegen
```

## Init project

``` sh
npm init -y
npm install commander fs-extra handlebars chalk ora
npm install -D typescript @types/node @types/fs-extra @types/handlebars
```

## Build & Test

``` sh
npm run build
npm link   # Makes `codegen` globally available
```

### Test generating TS

``` sh
npx codegen --templates ./templates --generate ts-class --name User
```


### Test generating Python

``` sh
npx codegen --templates ./templates --generate python-class --name User
```
