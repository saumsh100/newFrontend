FROM node:8-alpine

ARG FEATURE_FLAG_KEY
ARG GOOGLE_API_KEY
ARG API_URL
ARG INTERCOM_APP_ID
ARG LOGROCKET_APP_ID
ARG NODE_ENV
ARG HOST
ARG NPM_TOKEN
ARG MODE_ANALYTICS_ACCESS_KEY

ARG TZ=America/Los_Angeles

RUN apk update \
	&& apk --no-cache add --virtual builds-deps build-base python
RUN apk add --no-cache vips-dev fftw-dev \
	--update-cache --repository http://dl-cdn.alpinelinux.org/alpine/edge/testing/ \
	--repository http://dl-cdn.alpinelinux.org/alpine/edge/main/
RUN apk add --no-cache libc6-compat git tzdata

RUN ln -sf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /tmp
COPY package.json /tmp/
COPY .npmignore /tmp/
COPY .npmrc.example /tmp/

RUN npm cache clear --force
RUN npm install sharp

RUN cp .npmrc.example .npmrc
RUN CI=true npm install --production

RUN mkdir /app
WORKDIR /app/

COPY .babelrc /app/
COPY .sequelizerc /app/
COPY .npmignore /app/
COPY app.json /app/
COPY cypress.json /app/
COPY nodemon.json /app/
COPY package.json /app/
COPY Procfile /app/
COPY Procfile_dev /app/
COPY Procfile_dev_no_reminders /app/
COPY schema.html /app/

COPY client/ /app/client/
COPY cypress/ /app/cypress/
COPY electron/ /app/electron/
COPY scripts/ /app/scripts/
COPY server/ /app/server/
COPY tests/ /app/tests/
COPY webpack/ /app/webpack/

COPY statics/favicons /app/statics/favicons/
COPY statics/fontawesome /app/statics/fontawesome/
COPY statics/fonts /app/statics/fonts/
COPY statics/images /app/statics/images/
COPY statics/styles /app/static/styles/
COPY statics/clinic.html /app/statics/
COPY statics/electron_index.html /app/statics/
COPY statics/electron_user.html /app/statics/
COPY statics/electron_about.html /app/statics/

RUN cp -a /tmp/node_modules /app
RUN rm -rf /tmp/node_modules

RUN npm run postinstall

RUN npm install sequelize@^4.3.2 -g
RUN npm install sequelize-cli@^4.1.0 -g
RUN npm install pg -g

EXPOSE 80

CMD node server/bin/build/server.bundle.js
