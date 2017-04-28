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

`npm install -g foreman`

### Installation on Windows 10 (work in progress)
Run all commands PowerShell as admin:

# clone the repo: 
- git clone <repo url>

# install node-gyp globally
- npm install -g node-gyp

# installs MS build tools, python, sets PATH correctly for builds
- npm install --g --production windows-build-tools

# go into project dir and try bcrypt - it's the one that files due to incorrect build tools setup
- cd carecru
- npm install bcrypt

# foreman
- npm install -g foreman

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
