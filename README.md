# jevo.js
[![Build Status](https://travis-ci.org/tmptrash/jevo.js.svg?branch=master)](https://travis-ci.org/tmptrash/jevo.js) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/9bd160adb2da4ea08ff64ea8c4dbe14e)](https://www.codacy.com/app/tmptrash/jevo.js?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=tmptrash/jevo.js&amp;utm_campaign=Badge_Grade)

jevo.js is a native JavaScript/ES6 based, digital organisms evolution simulator. It's used for study the evolutionary biology of self-replicating and evolving computer programs ([digital organisms](https://en.wikipedia.org/wiki/Digital_organism)). This project similar to [Avida](https://en.wikipedia.org/wiki/Avida), but works with more abstract language (Digital Organism Script - DOS) instead of assembler. It uses special DOSVM for running DOS byte code and [distributed computing](https://en.wikipedia.org/wiki/Distributed_computing) to speed up the calculations. Generally, it consists of [servers](https://github.com/tmptrash/jevo.js/tree/v0.2/server/src), which are just a proxy between [clients](https://github.com/tmptrash/jevo.js/tree/v0.2/client/src). All calculations(organisms simulation) occures also on a client side.  It's possible to run the system in a "single" or "serverless" mode. For this, you have to run index.html(drop it into the browser) in Chrome without running server.

More details on [blog](https://jevosite.wordpress.com) and youtube [channel](https://www.youtube.com/playlist?list=PL1NiKjXMaBimPuybPIXkVuO1MYy53XcdW). Video presentation in russian is [here](https://www.youtube.com/watch?v=9ykr9KzcKq8).

# Requirements
- Last version of Chrome browser
- Last stable version of Node.js

# Installation
- Clone this repo to your local machine
- Go to the root folder of cloned repo
- Run `npm run install` to install all jevo.js dependencies
- Run `npm run build` to build client part
- If you want to run jevo.js in a "single" or "serverless" mode, run `./client/dist/index.html` under Chrome
- If you want to run jevo.js in a "distributed" mode, run server `npm run server` and then run `index.html` in browser
- Run tests using `npm run test` command if you need

___
P.S. If you `ES6 js developer` | `Canvas 2D developer` | `Node.js developer` | you just a <img align="center" width="18" height="18" src="https://github.com/tmptrash/jevo.js/raw/v0.2/assets/ninja-icon.png"> - join us!