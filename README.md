[![Maintainability](https://api.codeclimate.com/v1/badges/eb91211a2195c7becfe9/maintainability)](https://codeclimate.com/repos/5e7a83b04862a301a3004627/maintainability)

<!-- TOC -->
- [Setup For Development](#setup-for-development)
  - [Before Starting](#before-starting)
  - [Checkout Code](#checkout-code)
  - [Setting up Front End](#setting-up-front-end)
  - [Run](#run)
    - [Main Services](#main-services)
    - [Other Services](#other-services)
  - [Hot Reloading](#hot-reloading)
  - [Front-end](#front-end)
  - [Back-end](#back-end)
- [Running Tests](#running-tests)
<!-- /TOC -->

# Setup For Development
Please follow the steps below in the order they are layed out. We'll be using `NVM` to set up environments and run certain Node versions.

## Before Starting
- Install `Python` and `NVM`
  **For Mac/Linux**
    - Install Python and set environment variable. Mac should have it out of the box, make sure Xcode is up to date and you're good to go.
    - Download `NVM` using this website. https://github.com/creationix/nvm. Please read through this on how to use properly and migrate existing npm packages.
    - To download and install a certain Node version using `NVM`, run: `nvm install <VERSION>`.
    - To use a specific Node version run: `nvm use <VERSION>` (for example: `nvm use 8.11`)

  **For Windows**
    -  Open PowerShell as Administrator. Run `npm install --global --production windows-build-tools`. This installs the VS Build Tools and also Python 2.7
    - Download `nvm-windows` from https://github.com/coreybutler/nvm-windows and follow the steps in the document
    - To download and install a certain Node version using NVM, run `nvm install <VERSION>`
    - To use a specific Node version run: `nvm use <VERSION>` (for example: `nvm use 8.11`)
- Install Node versions by executing `NVM` in root folder. This will run the configurations in `.nvmrc` file
  - Install Node on version 8 with the command: `nvm install v8` and `nvm use v8` to set the desired version

## Checkout Code
Make sure you have access to CareCru's github repository To run CareCru application clone the following repository:
- Clone [CareCru/frontend](https://github.com/CareCru/frontend) `git clone https://github.com/CareCru/frontend.git`
- Clone [CareCru/backend](https://github.com/CareCru/backend) `git clone https://github.com/CareCru/backend.git`
- Clone [CareCru/api](https://github.com/CareCru/api) `git clone https://github.com/CareCru/api.git`


## Setting up Front End

1. Go to the frontend folder `cd frontend`.
2. Create a `.env` file and copy the following content into it:
```
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
LIVESESSION_ID=
EXECUTION_ENVIRONMENT= LOCAL | DEVELOPMENT | TEST | DEMO | PRODUCTION
# Time in seconds
POLLING_FOLLOWUP_INTERVAL=300
POLLING_SCHEDULE_INTERVAL=300
POLLING_REVENUE_INTERVAL=300
 ```
**Note**: Ask a team member for the keys to the `.env` file

3. Change `SERVER_PATH` env var with the path to your `backend` repo. `Hint:` run `pwd` while in your backend dir and use that path.
4. Run `npm run npmrc` to create a `.npmrc` file with the right token
5. Run `npm install`
6. Run `npm run client:build`
7. Run `npm run client:dev:server`

note: make sure you replace the SERVER_PATH in the `.env` file.

After the above procedure, your front end should be running on `http://localhost:5100/`

## Install Modules
Note: if you followed the above process you've probably already installed the node modules

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

# Run

### Main Services
It is useful to have your terminal application view split into 4 terminal panes.

|Order|Execution Directory| Command  | Description |
|---|---|---|---|
|1|backend/|`docker-compose up`| Starts 3rd-parth dependencies (see above) and shows their logs. To run this container in detached mode, use `-d` flag|
|2|backend/|`npm run start:dev`| Starts CareCru application |
|3|api/|`npm run start`| Starts new Nest application |
|-|any|-|Log tailing or anything similar|

If your backend service is running, you should now have the application running at `localhost:5000` and at `care.cru:5000` if you configured that as well.

### Other Services
You can run different jobs separately.

**NOTE**: This section needs more information about what is (if anything) is required to run these jobs independently.)

> **IMPORTANT:**
> Don't run `start:jobs` unless you know what you are doing. This command will enable communication jobs, as stated above. If any real patient information is loaded into the database, this will result in them being contacted.

* `npm run start:dev` - runs only the web service and the cron job, serving as a base to the other services
* `npm run start:jobs` - runs the CareCru jobs those including:
    - send reminders
    - send recalls
    - send reviews 
    - patient cache jobs - that updates information on the patients table for easier querying on the API. eg. first, next and last appointment dates and hygiene and recalls due dates.

# Hot Reloading

## Front-end

Before running the commands below, run `pwd` inside the server's directory to get the full path for the server. Copy that value into the `SERVER_PATH` env variable.

Run the following command in a separate tab, to see changes on the fly:

- server: `npm run client:dev:server`
- booking widget `npm run client:widget:watch`

Now, the application is hosted at `http://localhost:5100`. All non-static requests are transparently proxied to `http://localhost:5000`.

> **Troubleshooting**
> If you get a message like `Error occurred while trying to proxy` you need to check that the application is running. It may not yet be initialized, so just reload the page in a moment.
> If there are no changes even after page reload - be sure that you are accessing the application from `http://localhost:5100`, and not `http://localhost:5000`.

# Running Tests

To run all unit tests (including the existing frontend): `npm run test:jest`
