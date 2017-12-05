# construct
[![Build Status](https://travis-ci.org/tmptrash/jevo.js.svg?branch=master)](https://travis-ci.org/tmptrash/jevo.js) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/9bd160adb2da4ea08ff64ea8c4dbe14e)](https://www.codacy.com/app/tmptrash/jevo.js?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=tmptrash/jevo.js&amp;utm_campaign=Badge_Grade)

construct is a native JavaScript/ES6 based, digital organisms evolution simulator. It's used for study the evolutionary biology of self-replicating and evolving computer programs ([digital organisms](https://en.wikipedia.org/wiki/Digital_organism)). This project similar to [Avida](https://en.wikipedia.org/wiki/Avida), but works with more abstract language (Digital Organism Script - DOS) instead of assembler. It uses special DOSVM for running DOS byte code and [distributed computing](https://en.wikipedia.org/wiki/Distributed_computing) to speed up the calculations. Generally, it consists of [servers](https://github.com/tmptrash/jevo.js/tree/v0.2/server/src), which just a proxy between [clients](https://github.com/tmptrash/jevo.js/tree/v0.2/client/src). All calculations are made on a client side only.  It's possible to run the system in a "serverless" mode. For this, you have to run `index.html` (just drop it into the browser) in Chrome without server.

More details on [blog](https://jevosite.wordpress.com) and youtube [channel](https://www.youtube.com/playlist?list=PL1NiKjXMaBimPuybPIXkVuO1MYy53XcdW). Video presentation in russian is [here](https://www.youtube.com/watch?v=9ykr9KzcKq8).

# Requirements
- Last version of Chrome browser
- Last stable version of Node.js

# Installation
- Install [Chome](https://www.google.com/chrome/browser/desktop/index.html) browser
- Install [Node.js](https://nodejs.org/uk/)
- Clone this repo to your local machine
- Go to the root folder of cloned repo
- Run `npm run install` to install all construct dependencies
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

___
P.S. If you `ES6 js developer` | `Canvas 2D developer` | `Node.js developer` | you just a <img align="center" width="18" height="18" src="https://github.com/tmptrash/jevo.js/raw/v0.2/assets/ninja-icon.png"> - join us!