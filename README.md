# CareCru Platform

This README is outdated, but kept here anyways.
Please refer to this article in order to get up and running:
Running CareCru With Docker (https://carecru.atlassian.net/wiki/spaces/DEV/pages/71434254/How+to+Run+CareCru+with+Docker)

This repository is for all code necessary to the CareCru Platform but not including the CareCru Connector.

##### Backend

NodeJS, ExpressJS, PassportJS, PostgreSQL (Sequelize ORM)

##### Frontend

React, Redux, CSS Modules w/ SASS

## Install

1.  Install Postgres if not already installed (https://www.digitalocean.com/community/tutorials/how-to-install-and-use-postgresql-on-ubuntu-16-04).
2.  Use node and npm versions in package.json file, install them if not already installed. To do so, use
    Node Version Manager (https://github.com/creationix/nvm).
3.  Install Redis if not already installed (https://redis.io/)
4.  Clone the Repository: `git clone git@github.com:carecru/carecru.git`
5.  Navigate into root directory: `cd carecru`
6.  Install node modules: `npm install`
7.  Install postgres and setup sequelize (Info at the bottom)

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

1.  Start up PostgreSQL in background (use brew if using mac, see the guide above)
2.  Seed the database with development data: `npm run rebuild:seed`
    > **Note:** > `npm run rebuild:seed` can be re-run whenever a fresh DB is needed

## Redis Setup

Simply run `redis-server` in any terminal window.

## RabbitMQ Setup

Install RabbitMQ via brew

```
brew install rabbitmq
```

Edit .profile using vim (or editor of your choice)

```
vim ~/.profile
```

Add to file

```
export PATH="/usr/local/bin:/usr/local/sbin:$PATH"
```

Start RabbitMQ

```
rabbitmq-server
```

Stop RabbitMQ

```
rabbitmqctl stop
```

## Environment Variables

To run the application effectively, you need to acquire all of the necessary API keys.
node-forman allows us to throw these environment variables into a `.env` file that we gitignore.

Contact the repo admin to acquire the `.env` file.

## Run

1.  In a separate tab: `npm start`
2.  Navigate to `localhost:5000` to see application running
3.  Add the following subdomains to your `/etc/hosts` file:

```
127.0.0.1           care.cru
127.0.0.1        my.care.cru
127.0.0.1       api.care.cru
```

> **Note:**
> For purposes of testing and effective development, please continue this README to run the build-tools, and use localhost:5100 instead of localhost:5000.

## Build Tools

### Front-end

Run the following command in a separate tab, to see changes on the fly:

`npm run client:dev:server`

Now, the application is hosted at `http://localhost:5100`. All non-static requests are transparently proxied to `http://localhost:5000`.

> **Troubleshooting**
> If you get a message like `Error occurred while trying to proxy` you need to check that the application is running. It may not yet be initialized, so just reload the page in a moment.
> If there are no changes even after page reload - be sure that you are accessing the application from `http://localhost:5100`, and not `http://localhost:5000`.

#### Relay

Relay needs the graphQL queries to be compiled before sent to the server. After making edits to your queries, just run the relay script to generate new compiled artifacts:

`npm run relay`

Alternatively, you can pass the `--watch` option to watch for file changes in your source code and automatically re-generate the compiled artifacts:

> Note: Requires [watchman](https://facebook.github.io/watchman/) to be installed

`npm run relay -- --watch`

### Back-end

Be sure that you start application with `npm start` command. In a new terminal do next command to start watching on changes:

`npm run server:watch`

The Server will be restarted automatically.

#### GraphQL

Everytime a change is made to the GraphQL Schema a new static json representation of it needs to be updated. Just run:

`npm run update-schema`

### Running on custom `host:port`

By default `npm start` will run the Node server on `localhost:5000`. Webpack then starts a proxy server that will run on `localhost:5100`, which is the address that we ultimately connect to. However, it is possible to run both Webpack server and Node server on a different localhost:port. Changing Node's server host and port is not really needed, but if you run a VM or want to expose the Carecru application on your local network, you can use environment variables to set the host and port for Webpack. `npm` spins up Webpack in a new shell, so it does not care for `.env` file that the Node server sources. Hence, you can't put these vars in there. It has a global environment and environment vars that were part of the start command. Long story short, to set the host and port for Webpack, put the following into your `$HOME/.profile` file (or another bash file that is sourced when a login shell is created).

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

## Running Tests

Before running Cypress E2E tests, please restart the server with the following command:
`NODE_ENV="test" npm run start dev`

> **Note:**
> You can use this command instead of `npm start` when developing.
> Each time you run the Cypress test suite, the test database is re-seeded. Cypress runs this command: `NODE_ENV="test" npm run seeds`

Run the following command to execute all tests:
`npm run test`

To execute E2E tests only:
`npm run test:cypress`

To run server jest tests only:
`npm run test:jest`

## View on Heroku

To view pull-request app on Heroku domain for it is created as follows:
https://carecru-staging-pr-[PR_NUMBER].herokuapp.com

### Sequelize/Postgres

Run `npm install` to install sequelize and other libraries for postgres

First we need to install postgres. Follow up this link and setup database (MacOS: https://www.codementor.io/devops/tutorial/getting-started-postgresql-server-mac-osx)
Add to your .env file

```
POSTGRESQL_HOST="localhost"
POSTGRESQL_PORT=5432
POSTGRESQL_USER="user-name-you-have-created"
POSTGRESQL_PASSWORD="leave-empty-if-no-password"
POSTGRESQL_DATABASE="database-name-you-created"
```

install sequelize-cli (https://github.com/sequelize/cli)

```
npm install sequelize-cli
```

You can install it also as a global module, but then change package.json for `rebuild` command

To get info about commands type

```
sequelize help
```

You can find file `.sequelizerc` inside of root folder. It is used to set default variables for sequelize like model path or seeders path

To see example model go to `server/_models/Segment/segment.js`. Same structure can be used for all models.

Inside folde `server/seeders/` are seeder files. You can use this to seed database.

To see example usage in route, go to `server/api/routes/segment/index.js`

NOTE: I haven't added migrations

##### Rebuild/Seed database

To rebuild database schemas just type

```
npm run rebuild
```

##### Adding new model

You will find inside of `server/_models/index.js` file a line `models.push((require('./Segment').default(sequelize, Sequelize)));`
This line represent importing of a single model into the code. Just repeat that for all models.
