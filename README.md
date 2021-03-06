# Phaser 3 Typescript Webpack Template
[![GitHub release](https://img.shields.io/github/tag/div-int/hackman.svg)](https://GitHub.com/div-int/hackman/tags/)
![GitHub](https://img.shields.io/github/license/div-int/hackman.svg?style=popout)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/cf836f9d285f4a7a82e899c5840d9a55)](https://app.codacy.com/app/scottjmoore/hackman?utm_source=github.com&utm_medium=referral&utm_content=div-int/hackman&utm_campaign=Badge_Grade_Dashboard)

A Phaser 3 project template with Typescript support, ES6 support via [Babel 7](https://babeljs.io/) and [Webpack 4](https://webpack.js.org/)
that includes hot-reloading for development and production-ready builds.

Loading assets via JavaScript module `import` and Typescript module `require` is also supported.

## Installation

To use as a template for a new project you must clone the repo from github.com and not install from [npmjs.com](https://www.npmjs.com/package/@div-int/phaser3-typescript-webpack).

- git clone [https://github.com/div-int/phaser3-typescript-webpack.git](https://github.com/div-int/phaser3-typescript-webpack.git) **_NameOfProject_**
- cd **_NameOfProject_**
- npm install

## Requirements

[Node.js](https://nodejs.org) is required to install dependencies and run scripts via `npm`.

## Available Commands

| Command         | Description                                                                     |
| --------------- | ------------------------------------------------------------------------------- |
| `npm install`   | Install project dependencies                                                    |
| `npm start`     | Build project and open web server running project                               |
| `npm run build` | Builds code bundle with production settings (minification, uglification, etc..) |

## Writing Code

After cloning the repo, run `npm install` from your project directory. Then, you can start the local development
server by running `npm start`.

After starting the development server with `npm start`, you can edit any files in the `src` folder
and webpack will automatically recompile and reload your server (available at `[http://localhost:8080](http://localhost:8080)`
by default).

## Customizing Template

### Babel

You can write modern Typescript, ES6+ JavaScript and Babel will transpile it to a version of JavaScript that you
want your project to support. The targeted browsers are set in the `.babelrc` file and the default currently
targets all browsers with total usage over "0.25%" but excludes IE11 and Opera Mini.

    ```js
      "browsers": [
        ">0.25%",
        "not ie 11",
        "not op_mini all"
      ]
    ```

### Webpack

If you want to customize your build, such as adding a new webpack loader or plugin (i.e. for loading CSS or fonts), you can
modify the `webpack/base.js` file for cross-project changes, or you can modify and/or create
new configuration files and target them in specific npm tasks inside of `package.json'.

## Deploying Code

After you run the `npm run build` command, your code will be built into a single bundle located at
`dist/bundle.min.js` along with any other assets you project depended.

If you put the contents of the `dist` folder in a publicly-accessible location (say something like [http://mycoolserver.com](http://mycoolserver.com),
you should be able to open [http://mycoolserver.com/index.html](http://mycoolserver.com/index.html) and play your game.
