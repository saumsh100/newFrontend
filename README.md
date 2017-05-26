# CareCru Platform v3

This repository is for all code necessary to the CareCru Dashboard.

##### Backend
NodeJS, ExpressJS, PassportJS, RethinkDB (thinky.io ORM)

##### Frontend
React, Redux, Sass

## Install

Install RethinkDB (https://www.rethinkdb.com/docs/install/).
Use node and npm versions in package.json file, install them if not already installed.

`git clone git@github.com:carecru/carecru.git`

`cd carecru`

`npm install`

### Installation on Windows 10 (work in progress)
Run all commands PowerShell as admin:

clone the repo: 
- git clone <repo url>

install node-gyp globally
- npm install -g node-gyp

installs MS build tools, python, sets PATH correctly for builds
- npm install --g --production windows-build-tools

go into project dir and try bcrypt - it's the one that files due to incorrect build tools setup
- cd carecru
- npm install bcrypt

If there are problems with build and you are changing order of installation, build utils you are installing (e.g. Visual Studio, Build tools, etc) before running `npm install <whatever>` make sure to remove the node_modules directory and clean cache `npm cache clean`. Not doing that may cause problems (or may not) - better do to be sure you have a clean folder.

## Database Setup

`rethinkdb`

Seed database with development data. In a separate tab at the top of carecru repo

`node ./server/bin/seeds.js`

Can be re-run whenever a fresh DB is needed.

## Environment Variables

To run the application effectively, you need to acquire all of the necessary API keys.
node-forman allows us to throw these environment variables into a `.env` file that we gitignore.

Contact the repo admin to acquire the `.env` file.

## Run

`rethinkdb` (if not already running)

In a separate tab at the top of carecru repo

`npm start`

http://localhost:5000

Subdomain Applications

add the following to `/etc/hosts`

```
127.0.0.1           carecru.dev
127.0.0.1        my.carecru.dev
127.0.0.1       api.carecru.dev
```

## Build Tools
### Front-end

You have to run next command (in a separate tab) to see changes on a fly.

`npm run client:dev:server`

So now application hosted on `http://localhost:5100`. All not static requests are transparently proxied to `http://localhost:5000`.

#### Possible pitfalls
- If you get a message like `Error occured while trying to proxy` you need to check application is running. It could be not initialized yet, so just reload page in a moment.
- If there are no changes even after page reload - be sure that you get application from a right endpoint `http://localhost:5100` not a `http://localhost:5000`.

### Back-end

Be sure that you start application with `npm start` command. In a new terminal do next command to start watching on changes:

`npm run server:watch`

Server will be restarted automatically.

### Running on custom `host:port`
By default `npm start` will run the Node server on `localhost:5000`. Webpack then starts a proxy server that will run on `localhost:5100`, which is the address that we ultimately connect to.  However, it is possible to run both Webpack server and Node server on a different localhost:port. Changing Node's server host and port is not really needed, but if you run a VM or want to expose the Carecru application on your local network, you can use environment variables to set the host and port for Webpack. `npm` spins up Webpack in a new shell, so it does not care for `.env` file that the Node server sources. Hence, you can't put these vars in there. It has a global environment and environment vars that were part of the start command. Long story short, to set the host and port for Webpack, put the following into your `$HOME/.profile` file (or another bash file that is sourced when a login shell is created).

```
export SERVER_HOST="localhost"
export SERVER_PORT=5000 
export WP_PROXY_PORT=8080 
export WP_PROXY_HOST="carecru.dev"
```

If you use `carecru.dev` for the proxy host in the code above, make sure that it resolves to something in `/etc/hosts`. Or just do this: `export WP_PROXY_HOST="192.168.56.1"`. Then in your browser you can access the application on `carecru.dev:8080` or `192.168.56.1:8080` respectively.

If no environment variables are provided, then Node server defaults to `localhost:5000` and Webpack defaults to `localhost:5100`.

#### Optional
If you use tmux you can run `sh scripts/run-server.sh`. This will spin up 3 panes with the Node server and two Webpack processes in those panes.

## View on Heroku

To view pull-request app on Heroku domain for it is created as follows:
https://carecru-staging-pr-[PR_NUMBER].herokuapp.com


## Useful notes
### Rethink
It is also possible to run rethinkdb as a daemon from any directory hidden in the background:
```
rethinkdb --daemon -d <CARECRU_CODE_DIR>
```
CARECRU_CODE_DIR is the directory where you want the `rethinkdb_data` to reside. Change accordingly.

On Linux (and alike) system you can alias this command for quicker access to it:
```
echo alias rundb='rethinkdb --daemon -d <CARECRU_CODE_DIR>' >> ~/.profile
```

This will run it in the background as daemon process so you won't need to keep a terminal window for it. To kill it use your systems task manager or run `pkill rethinkdb` and then check that it's killed `ps -ef | grep rethinkdb`. However, you should not need to do this often.
