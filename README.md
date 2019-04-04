# CareCru Platform
[![CodeFactor](https://www.codefactor.io/repository/github/carecru/carecru/badge)](https://www.codefactor.io/repository/github/carecru/carecru)
[ ![Codeship Status for CareCru/carecru](https://app.codeship.com/projects/609e8860-1974-0135-f0cd-2681b2cba166/status?branch=master)](https://app.codeship.com/projects/219293)

This README is outdated, but kept here anyways.
Please refer to this article in order to get up and running:
Running CareCru With Docker (https://carecru.atlassian.net/wiki/spaces/DEV/pages/71434254/How+to+Run+CareCru+with+Docker)

This repository is for all code necessary to the CareCru Platform but not including the CareCru Connector.

##### Backend

NodeJS, ExpressJS, PassportJS, PostgreSQL (Sequelize ORM)

##### Frontend

React, Redux, CSS Modules w/ SASS

##### Dependencies

 - redis - [how to start redis as container](https://carecru.atlassian.net/wiki/spaces/EN/pages/227606543/Starting+single+redis+as+container)
 - rabbitmq - [how to start rabbitmq as container](https://carecru.atlassian.net/wiki/spaces/EN/pages/227442713/Starting+single+rabbitmq+as+container)
 - postgreSQL - [how to start postgres as container](https://carecru.atlassian.net/wiki/spaces/EN/pages/227475499/Starting+single+postgres+as+container)
 - node (same version as in package.json)
 - npm (same version as in package.json)
 - Add the following subdomains to your `/etc/hosts` file:

```
127.0.0.1           care.cru
127.0.0.1           my.care.cru
127.0.0.1           api.care.cru
```

## Install and Environment Variables

1.  Clone the Repository: `git clone git@github.com:carecru/carecru.git`
2.  Navigate into root directory: `cd carecru`
3.  run the following command to creating a *.env* file:
```
cat << EOF > .env
NODE_ENV="development"
NPM_TOKEN=
BLUEBIRD_W_FORGOTTEN_RETURN=0
POSTGRESQL_HOST=localhost
POSTGRESQL_PORT=5432
POSTGRESQL_USER=
POSTGRESQL_PASSWORD=
POSTGRESQL_ROLE=
POSTGRESQL_DATABASE=carecru_development_docker
POSTGRESQL_DB=carecru_development_docker
REDIS_URL=redis://localhost:6379
RABBITMQ_URL=amqp://localhost:5672
MANDRILL_API_KEY=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
S3_LOGGER_ENABLED=false
S3_LOGS_BUCKET_NAME=
S3_LOGS_ACCESS_KEY_ID=
S3_LOGS_SECRET_ACCESS_KEY=
S3_BUCKET=
FEATURE_FLAG_KEY=
LAUNCH_DARKLY_SDK_KEY=
CALLRAIL_API_KEY=
CALLRAIL_API_ACCOUNTID=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_NUMBER=
VENDASTA_API_KEY=
VENDASTA_API_USER=
MODE_ANALYTICS_ACCESS_KEY=
MODE_ANALYTICS_SECRET=
HOST=care.cru:5100
MY_HOST=my.care.cru:5100
SERVER_HOST=0.0.0.0
WP_PROXY_HOST=0.0.0.0
API_URL=http://0.0.0.0:5100
GRAPHQL_SERVER_URL=http://localhost:8001/graphql
EOF
```
4.  Install node modules: `npm install`

## PostgreSQL Setup

1.  Rebuild and seed the database with development data: `npm run rebuild:seed`
    > **Note:** > `npm run rebuild:seed` can be re-run whenever a fresh DB is needed

## NVM Setup

1. Download nvm using this website. https://github.com/creationix/nvm. Please read through this on how to use properly and migrate existing npm packages. 

2. To download a certain node version using nvm, use the following: `nvm install version`. For the Legacy API (this repo) run: `nvm install 8.11` and for Nest API run: `nvm install 10.0`.

3. After downloading both node 8.11 (used by this repo) and node 10.0 (used the api repo), you can switch between them by using: `nvm use "version"`, for example: `nvm use 8.11.4`.

## Run

1.  In a separate tab run: `npm run startdev`
> **Note:**
> Don't run `npm start` unless you know what you are doing. This command will enable communication jobs, as well as the main application, such as the emails and reminders services. If any real patient information is loaded into the database, this will result in them being contacted.

2.  Navigate to `localhost:5000` to see application running
> **Note:**
> For purposes of testing and effective development, please continue this README to run the build-tools, and use localhost:5100 instead of localhost:5000.

## Running using Docker

1. On the root project directory, run the following command: `docker-compose up` to start up the development environment.

2. 
    > **Note:**
    > Run these commands in a different tab.
    - To gracefully stop the environement and remove the containers run: `docker-compose down`.
    - To just stop the environment without removing the containers run: `docker-compose stop`.
    - To kill the environment, either `CTRL+C` or in a separate tab run: `docker-compose kill`.
    
> **Note:**
> For more info on the commands available and what each one does, visit: https://docs.docker.com/compose/reference/overview/

If this is the first time running the development environment, in the root project directory, run the following commands in order: 

1. `npm install`.

2. To start up the dev evironment run: `npm run startdev`.

> **Note:**
> Don't worry if this takes long. It usually takes about 20-30 mins to install everything.

- To run server watch so that any changes to files automatically rebuild the evironment, run: `npm run server:watch`.

- To run the client dev server, run: `npm run client:dev:server`.

## Build Tools
### Front-end

Run the following command in a separate tab, to see changes on the fly:

`npm run client:dev:server`

Now, the application is hosted at `http://localhost:5100`. All non-static requests are transparently proxied to `http://localhost:5000`.

> **Troubleshooting**
> If you get a message like `Error occurred while trying to proxy` you need to check that the application is running. It may not yet be initialized, so just reload the page in a moment.
> If there are no changes even after page reload - be sure that you are accessing the application from `http://localhost:5100`, and not `http://localhost:5000`.

### Relay

Relay needs the graphQL queries to be compiled before sent to the server. After making edits to your queries, just run the relay script to generate new compiled artifacts:

`npm run relay`

Alternatively, you can pass the `--watch` option to watch for file changes in your source code and automatically re-generate the compiled artifacts:

> Note: Requires [watchman](https://facebook.github.io/watchman/) to be installed

`npm run relay -- --watch`

### Back-end

Be sure that you start application with `npm start` command. In a new terminal do next command to start watching on changes:

`npm run server:watch`

The Server will be restarted automatically.

### GraphQL

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

### Optional

If you use tmux you can run `sh scripts/run-server.sh`. This will spin up 3 panes with the Node server and two Webpack processes in those panes.

### Running Tests

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

### Adding new model

You will find inside of `server/_models/index.js` file a line `models.push((require('./Segment').default(sequelize, Sequelize)));`
This line represent importing of a single model into the code. Just repeat that for all models.
