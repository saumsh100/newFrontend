# Hub publish a new version

The base of hub application resides within `/electron` folder. Before doing anything else, it is important to install electron's app dependencies.

- Go to `electron` folder
- Install electron app modules `npm install`
- Switch back to root dir of carecru repo
- Build frontend side with API_URL env included (if required, assumed `https://carecru.io` by default) which is the backend address hub is going to connect to
`API_URL=http://localhost:5000 npm run client:build:prod`
- Edit `/electron/package.json` and set the version you want to publish. If channel is required, include it after version (ex. 1.0.0-beta)
- Within root dir, run:
    - `AWS_ACCESS_KEY_ID=<AWS_KEY> AWS_SECRET_ACCESS_KEY=<AWS_SECRET> npm run electron:publish:dev` to publish new version to **DEVELOPMENT** bucket
    - Or `AWS_ACCESS_KEY_ID=<AWS_KEY> AWS_SECRET_ACCESS_KEY=<AWS_SECRET> npm run electron:publish:prod` to publish new version to **PRODUCTION** bucket.


Rest of the job is done by the updater.

### Versioning

Comparing of versions (biggest is always chosen for update if channel is allowed for client):
- 1.0.0 < 2.0.0 < 2.1.0 < 2.1.1
- 1.0.0-alpha < 1.0.0
- 1.0.0-alpha < 1.0.0-alpha.1 < 1.0.0-beta < 1.0.0-beta.2 < 1.0.0-beta.11 < 1.0.0-rc.1 < 1.0.0

### Channel usage
Out of the box, there are 2 pre-release channels included in electron-updater beta and alpha, if necessary custom channel name can be introduced.

- Users that initially download the stable release of app (ex. 0.1.0) will receive only latest release, for example: 0.1.1, 0.2.0, 1.0.0. Etc. and will not receive any pre-release or custom channel release
- Users that initially download -beta release (ex. 0.1.0-beta) will receive latest releases and beta releases (whichever is newer), example: 0.1.1, 0.2.0-beta, 0.2.1. Will NOT receive alpha releases.
- Users that initially download -alpha release (ex. 0.1.0-alpha) will receive latest releases and alpha releases (whichever is newer), example: 0.1.1, 0.2.0-alpha, 0.2.0-beta, 0.2.1.
- Users that initially download -customChannel release (ex. 0.1.0-feature) will receive latest releases and customChannel releases (whichever is newer), example: 0.1.1, 0.2.0-customChannel, 0.2.1. Will NOT receive alpha or beta releases.

### Suggested release process for hub

Staging percentage info can be ignored for now.

![release-process](https://image.prntscr.com/image/B-aKfTVJSSCKUccvGANbEg.png)
