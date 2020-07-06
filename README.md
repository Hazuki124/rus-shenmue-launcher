## Install

```
npm install --global windows-build-tools@4.0.0
yarn

```

## Starting Development

Start the app in the `dev` environment. This starts the renderer process in [**hot-module-replacement**](https://webpack.js.org/guides/hmr-react/) mode and starts a webpack dev server that sends hot updates to the renderer process:

```bash
yarn dev
```

## Generate migrations

migration:create -n {ClassName} -d migration

## Packaging for Production

To package apps for the local platform:

```bash
yarn package-win
```

## Docs

See our [docs and guides here](https://electron-react-boilerplate.js.org/docs/installation)


## Throubleshooting

In order to compile sqlite3 module remove these lines from node_modules typeorm

"main": "./index.js",
"browser": {
"./browser/driver/postgres/PostgresDriver.js": "./browser/platform/BrowserDisabledDriversDummy.js",
"./browser/driver/oracle/OracleDriver.ts": "./browser/platform/BrowserDisabledDriversDummy.js",
"./browser/driver/mysql/MysqlDriver.js": "./browser/platform/BrowserDisabledDriversDummy.js",
"./browser/driver/sqlserver/SqlServerDriver.ts": "./browser/platform/BrowserDisabledDriversDummy.js",
"./browser/driver/mongodb/MongoDriver.js": "./browser/platform/BrowserDisabledDriversDummy.js",
"./browser/driver/mongodb/MongoQueryRunner.js": "./browser/platform/BrowserDisabledDriversDummy.js",
"./browser/entity-manager/MongoEntityManager.js": "./browser/platform/BrowserDisabledDriversDummy.js",
"./browser/repository/MongoRepository.js": "./browser/platform/BrowserDisabledDriversDummy.js",
"./index.js": "./browser/index.js"
},
