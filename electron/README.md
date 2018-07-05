# Hub dev environment

The base of hub application resides within `/electron` folder. Before doing anything else, it is important to install electron's app dependencies.

- Install electron dependencies using `npm run electron:install`
- Run backend server as its usually run (`npm start`)
- Run frontend dev server `npm run client:dev:server`
- Run Electron app `npm run electron:dev`

That's it, the application should be up and running.

Application is set to run in development mode by running `electron:dev` command, as it adds `NODE_ENV=development` env variable. If no `NODE_ENV` is set, it is assumed that application is run in production mode.

To check logs: `tail -f -n 40 ~/Library/Logs/carecru-hub/log.log` (mac).

[Publish instructions](PUBLISH.md)
