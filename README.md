# construct
[![Build Status](https://travis-ci.org/tmptrash/construct.svg?branch=master)](https://travis-ci.org/tmptrash/construct) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/da2d5c5f53d04df79c9aae3599555b4e)](https://www.codacy.com/app/flatline/construct?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=tmptrash/construct&amp;utm_campaign=Badge_Grade)

<p align="justify"><b>construct</b> is a native JavaScript/ES6 based, digital organisms evolution simulator. It's used for study the evolutionary biology of self-replicating and evolving computer programs (<a href="https://en.wikipedia.org/wiki/Digital_organism">digital organisms</a>). This project similar to <a href="https://en.wikipedia.org/wiki/Avida">Avida</a>, but works with more abstract language (Digital Organism Script - DOS) instead of assembler. It uses special DOSVM for running DOS byte code and <a href="https://en.wikipedia.org/wiki/Distributed_computing">distributed computing</a> to speed up the calculations. Generally, it consists of <a href="https://github.com/tmptrash/jevo.js/tree/v0.2/server/src">servers</a>, which just a proxies between <a href="https://github.com/tmptrash/jevo.js/tree/v0.2/client/src">clients</a>. All calculations are made on a client side only.  It's possible to run the system in a "serverless" mode. For this, you have to run index.html (just drop it into the browser) in Chrome without server. More details for russian speaking people on <a href="https://jevosite.wordpress.com">blog</a> and youtube <a href="https://www.youtube.com/playlist?list=PL1NiKjXMaBimPuybPIXkVuO1MYy53XcdW">channel</a>. See video presentation <a href="https://www.youtube.com/watch?v=9ykr9KzcKq8">here</a>.
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

Note: to improve speed, type `man.api.visualize(false)` in Chrome's devtool console during application run
___
P.S. If you `ES6 js developer` | `Canvas 2D developer` | `Node.js developer` | you just a <img align="center" width="18" height="18" src="https://github.com/tmptrash/jevo.js/raw/v0.2/assets/ninja-icon.png"> - join us!