# construct
[![Build Status](https://travis-ci.org/tmptrash/construct.svg?branch=master)](https://travis-ci.org/tmptrash/construct) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/da2d5c5f53d04df79c9aae3599555b4e)](https://www.codacy.com/app/flatline/construct?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=tmptrash/construct&amp;utm_campaign=Badge_Grade)

<p align="justify"><b>construct</b> is a native JavaScript/ES6 based, digital organisms evolution simulator. It's used for study the evolutionary biology of self-replicating and evolving computer programs (<a href="https://en.wikipedia.org/wiki/Digital_organism">digital organisms</a>). This project similar to <a href="https://en.wikipedia.org/wiki/Avida">Avida</a>, but works with more abstract language (Digital Organism Script - DOS) instead of assembler. It uses special <a href="https://github.com/tmptrash/construct/tree/master/client/src/jsvm">DOSVM</a> for running DOS byte code and <a href="https://en.wikipedia.org/wiki/Distributed_computing">distributed computing</a> to speed up the calculations. Generally, it consists of <a href="https://github.com/tmptrash/construct/tree/v0.2/server/src">servers</a>, which just a proxies between <a href="https://github.com/tmptrash/construct/tree/v0.2/client/src">clients</a>. All calculations are made on a client side only.  It's possible to run the system in a "serverless" mode. For this, you have to run index.html (just drop it into the browser) in Chrome without server. More details for russian speaking people on <a href="https://jevosite.wordpress.com">blog</a> and youtube <a href="https://www.youtube.com/playlist?list=PL1NiKjXMaBimPuybPIXkVuO1MYy53XcdW">channel</a>. See video presentation <a href="https://www.youtube.com/watch?v=9ykr9KzcKq8">here</a>.
</p>

# Requirements
- Last version of Chrome browser
- Last stable version of Node.js

# Installation
- Install [Chome](https://www.google.com/chrome/browser/desktop/index.html) browser
- Install [Node.js](https://nodejs.org/uk/)
- Clone this repo to your local machine
- Go to the root folder of cloned repo
- Run `npm install` to install all dependencies
- Run `npm run build` to build client part
- Run tests using `npm run test` command if you need

# Run
- To run construct in a "serverless" mode, just open `./client/dist/index.html` in Chrome
- To run construct in a "distributed" mode, you have to:
    - Choose some host in your local netwok for server
    - Clone construct repo to this host
    - Go to configuration `./client/src/share/Config.js`, find `serverHost` option and change it to the IP, of your server host. You may use `ipconfig` under windows to get server's IP
    - Run `npm run build` command in a terminal from the root folder
    - Run server `npm run server` on chosen host
    - Copy `./client/dist/index.html` and `./client/dist/app.js` on all your remote machines and run it there under Chrome

# Main commands
As an administrator, you may affect the system by command line API. For instance, you may obtain amount of organisms in current population or set new configuration in real time. For this, you have to open Chrome console (press `F12`) and type `man.api[.namespace].xxx()`. Where `namespace` is an optional unit or module and `xxx()` is supported command of this module. It's possible to use `desc` property to get command description. Example: `man.api.getConfig.desc`. Here are all available commands separated by namespace:
- global namespace - `man.api`:
  - `man.api.visualize(show:Boolean = true)` - Turns on/off visualization in browser for current instance (world). Turning visualization off, increases application speed. You may use hot key: Ctrl-V.
  - `man.api.toJS(code:Array)` - Converts byte code array into human readable JavaScript based code. This function is low level. For using it you have to get organism's virtual machine reference and then use it's `code` property. For example: `man.api.formatCode(man.api.organisms.getOrganism('128').vm.code)`. This example will find organism with id `128` and shows his byte code.
  - `man.api.version` - Returns current app version
  - `man.api.getConfig(path:String)` - Returns specified config value. First parameter is a namespace (optional) and config name. For example, to get maximum amount of organisms in current instance/world type: `man.api.getConfig('organisms.orgMaxOrgs')`. Example of organism related configs you may find [here](https://github.com/tmptrash/construct/blob/master/client/src/manager/plugins/organisms/Config.js). Other configuration parameters are located in files with name `Config.js`.
  - `man.api.setConfig(path:String, value:Any)` - Sets configuration value in real time. Opposite to `getConfig()`.
- charts namespace - `man.api.charts`. This namespace is related to statistics in charts. There are many parameters like average code size, organisms amount, amount of picked energy and so on. See details [here](https://github.com/tmptrash/construct/blob/master/client/src/manager/plugins/status/charts/Config.js) in charts property. You may show and hide different charts on a canvas, locate them and reset any time you need:
  - `man.api.charts.on([[name:String = undefined[, show:Boolean = true]])` - shows chart(s) by name. List of all available names you may find [here](https://github.com/tmptrash/construct/blob/master/client/src/manager/plugins/status/charts/Config.js). Example: `man.api.charts.on('energy')` - will show chart of average organism energy at the moment. Calling this method without parameters shows all available charts. Calling this method with only one string parameter shows specified chart. Calling this method with two parameters shows/hides specified chart depending on second Boolean parameter. Example: `man.api.charts.on()` - shows all charts. `man.api.charts.on('energy')` - shows energy chart only. `man.api.charts.on('energy', false)` - hides energy chart only.
  - `man.api.charts.off(name:String = undefined)` - opposite to `on()`. Hides specified or all charts (without parameters) from the canvas.
  - `man.api.charts.pos(name:String, pos:String)` - Locates chart according to specified position. Available positions are: `full`, `top`, `down`, `left`, `right`, `topleft`, `downleft`, `topright`, `downright`. Example: `man.api.charts.pos('code', 'full')` - shows `code` trend chart on full screen. All available chart names are [here](https://github.com/tmptrash/construct/blob/master/client/src/manager/plugins/status/charts/Config.js).
  - `man.api.charts.pos9(name:String, x:Number, y:Number)` - The same like `pos()`, but with chart coordinates in 3x3 grid. For example: `man.api.charts.pos9('energy', 0, 2)` - will positioning energy chart at the location `x:0, y:2`.
  - `man.api.charts.pos16(name:String, x:Number, y:Number)` - The same like `pos9()`, but for grid 4x4.
  - `man.api.charts.transparent(name:String, val:Number)` - Sets chart transparency. `val` should be between `0..1`. `val` parameter is optional. In this case all charts will have same transparency.
Note: to improve speed, type `man.api.visualize(false)` in Chrome's devtool console during application run
___
P.S. If you are a `ES6 js developer` | `Canvas 2D developer` | `Node.js developer` | you just a <img align="center" width="18" height="18" src="https://github.com/tmptrash/construct/raw/v0.2/assets/ninja-icon.png"> - join us!
