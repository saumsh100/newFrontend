# CareCru Platform v3

This repository is for all code necessary to the CareCru Dashboard.

##### Backend
NodeJS, ExpressJS, PassportJS, RethinkDB (thinky.io ORM)

##### Frontend
React, Redux, Sass, Reactstrap (Bootstrap 4.0)

## Install

Install RethinkDB (https://www.rethinkdb.com/docs/install/). 
Use node and npm versions in package.json file, install them if not already installed.

`git clone git@github.com:carecru/carecru.git`

`cd carecru`

`npm install`

## Database Setup

`rethinkdb`

Seed database with development data. In a separate tab at the top of carecru repo

`node ./server/bin/seeds.js`

## Run

`rethinkdb` (if not already running)

In a separate tab at the top of carecru repo

`npm start`

http://localhost:5000
