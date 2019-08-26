[![CodeFactor](https://www.codefactor.io/repository/github/carecru/frontend/badge)](https://www.codefactor.io/repository/github/carecru/frontend)
[ ![Codeship Status for CareCru/carecru](https://app.codeship.com/projects/609e8860-1974-0135-f0cd-2681b2cba166/status?branch=master)](https://app.codeship.com/projects/219293)

<!-- TOC -->
- [Setup For Development](#setup-for-development)
    - [Before Starting](#before-starting)
    - [Checkout Code](#checkout-code)
    - [Create Environment File](#create-environment-file)
        - [carecru/carecru .env file](#carecrucarecru-env-file)
        - [carecru/api .env file](#carecruapi-env-file)
    - [Install Modules](#install-modules)
    - [Run Third-Party Software](#run-third-party-software)
    - [Seed the database](#seed-the-database)
    - [Setup /etc/hosts](#setup-etchosts)
    - [Run](#run)
        - [Main Services](#main-services)
        - [Other Services](#other-services)
    - [Hot Reloading](#hot-reloading)
    - [Front-end](#front-end)
    - [Back-end](#back-end)
- [Running Tests](#running-tests)
<!-- /TOC -->

# Setup For Development
Please follow the steps below in the order they are layed out.

## Before Starting
- Install Docker and get more familiar with it
  - Please get familiar with basics of Docker and main commands such as `docker-compose down`, `docker-compose stop`, `docker-compose kill`: [Docker Overview](https://docs.docker.com/compose/reference/overview/)
- Install NVM
    - Download nvm using this website. https://github.com/creationix/nvm. Please read through this on how to use properly and migrate existing npm packages.
    - To download and install a certain Node version using NVM, run: `nvm install <VERSION>`.
    - To use a specific Node version run: `nvm use "version"` (for example: `nvm use 8.11`)
- Install Node 8.11 and Node LTS using NVM (you need to be able to switch between them)

## Checkout Code
To run CareCru application clone two repositories locally:
- Clone [carecru/carecru](https://github.com/carecru/carecru) repository to `carecru/` directory: `git clone git@github.com:carecru/carecru.git`
- Clone [carecru/api](https://github.com/carecru/api) repository to `api/` directory: `git clone git@github.com:carecru/api.git`

## Create Environment File

### carecru/carecru .env file
- Navigate into cloned CareCru repository: `cd carecru`
- Run the following command to create the `.env` file:
```
cat << EOF > .env
NODE_ENV=development
NPM_TOKEN=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
S3_LOGGER_ENABLED=false
S3_LOGS_BUCKET_NAME=
S3_LOGS_ACCESS_KEY_ID=
S3_LOGS_SECRET_ACCESS_KEY=
S3_BUCKET=
FEATURE_FLAG_KEY=5a332a3c95e24c205546f0df
GOOGLE_API_KEY=AIzaSyA6U9et5P5Zjn4DIeZpTlBY7wNr21dvc9Q
HOST=care.cru:5100
SERVER_HOST=localhost
WP_PROXY_HOST=localhost
API_URL=http://0.0.0.0:5100
REBRANDLY_SHORT_DOMAIN=
INTERCOM_APP_ID=enpxykhl
REGION="CA"
NODE_OPTIONS=--max-old-space-size=8192
SERVER_PATH=
EOF
```

### carecru/api .env file
Please go to [carecru/api](https://github.com/carecru/api) repository README file to see how to configure it.

## Install Modules
Run `npm ci` in both `carecru/` and `api/` directories. Note that running `npm ci` won't install development dependencies like the testing runing. For that run `npm install`.

## Run Third-Party Software
All third-party dependencies are incapsulated by Docker containers. There is one container per server all managed by `Docker Compose`:

- Redis
- Rabbitmq
- PostgreSQL

To run all containers:
- Go to the `carecru/` directory
- Run `docker-compose up`
  - run `docker-compose up -d` if you want to free up the terminal and not see the logs. Keep in mind that then you will need to look at the logs in using `docker logs` command.

## Create and Seed the database
- From the `api/` director run `npm run migration:run` to create the database and init the tables
- From the `carecru/` directory run: `npm run seed` to remove all existing data from the development instance (if there was any data) of the database and re-create test data from the seeds.

## Setup /etc/hosts
- This is required for the Booking Widget and patient app (patient-facing appointment confirmation and other similar functionality) development and testing.
- This is optional for Back End and Front End developers and frequently required for Connector developers.

The application runs on `care.cru` hostname that can resolve to either `127.0.0.1` or an IP that's specified in `/etc/hosts` file. For Connector development this is useful as it allows syncing Connector to the API as long as they are on the same network. For example, if the Connector is running in VirtualBox with vboxnet0 interface, then `/etc/hosts` will look like this:

```
$ cat /etc/hosts
192.168.56.1    care.cru
192.168.56.1    my.care.cru
192.168.56.1    api.care.cru
```

This way the API can be reached from within the VM. There are other ways to achieve this (for example, using the main network interface on your computer; either way would work).

## Run

### Main Services
It is useful to have your terminal application view split into 4 terminal panes.

|Order|Execution Directory| Command  | Description |
|---|---|---|---|
|1|carecru/|`docker-compose up`| Starts 3rd-parth dependencies (see above) and shows their logs|
|2|carecru/|`npm run start:dev`| Starts CareCru application |
|3|api/|`npm run start`| Starts new Nest application |
|-|any|-|Log tailing or anything similar|

You should now have the application running at `localhost:5000` and at `care.cru:5000` if you configured that as well.

### Other Services
You can run different jobs separately.

**NOTE**: This section needs more information about what is (if anything) is required to run these jobs independently.)

> **IMPORTANT:**
> Don't run `npm start:dev` or `npm run start:commsJobs` unless you know what you are doing. Those commands will enable communication jobs, as stated above. If any real patient information is loaded into the database, this will result in them being contacted.

* `npm run start:dev` - runs all CareCru services at once in development mode
* `npm run start:web` - runs only the web service and the cron job, serving as a base to the other services
* `npm run start:commsJobs` - runs the communications jobs those serving to send reminders, recalls and reviews.
* `npm run start:patientCache` - runs the patient cache jobs that updates information on the patients table for easier querying on the API. eg. first, next and last appointment dates and hygiene and recalls due dates.

## Hot Reloading

## Front-end

Before running the commands below, run `pwd` inside the server's directory to get the full path for the server. Copy that value into the `SERVER_PATH` env variable.

Run the following command in a separate tab, to see changes on the fly:

- server: `npm run client:dev:server`
- booking widget `npm run client:widget:watch`

Now, the application is hosted at `http://localhost:5100`. All non-static requests are transparently proxied to `http://localhost:5000`.

> **Troubleshooting**
> If you get a message like `Error occurred while trying to proxy` you need to check that the application is running. It may not yet be initialized, so just reload the page in a moment.
> If there are no changes even after page reload - be sure that you are accessing the application from `http://localhost:5100`, and not `http://localhost:5000`.

## Back-end
Be sure that you start application with `npm start:web/dev` command. In a new terminal do next command to start watching on changes:

`npm run server:watch`

The Server will be restarted automatically.

# Running Tests

**NOTE** This section may not be up to date.

Run the following command to execute all backend tests: `npm run test`

To run api tests: `npm run test:api`

To run lib tests: `npm run test:lib`

To run graphql tests: `npm run test:graphql`

To run all unit tests (including the existing frontend): `npm run test:jest`
