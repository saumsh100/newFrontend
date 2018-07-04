# Hub dev environment

The base of hub application resides within `/electron` folder. Before doing anything else, it is important to install electron's app dependencies.

- Install electron dependencies using `npm run electron:install`
- Run backend server as its usually run (`npm start`)
- Run frontend dev server `npm run client:dev:server`
- Run Electron app `npm run electron:dev`

That's it, the application should be up and running.

To check logs: `tail -f -n 40 ~/Library/Logs/carecru-hub/log.log` (mac).

[Publish instructions](PUBLISH.md)