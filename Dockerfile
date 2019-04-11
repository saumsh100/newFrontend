FROM node:8-alpine

ARG NPM_TOKEN
ARG NODE_ENV
ARG LOGROCKET_APP_ID
ARG INTERCOM_APP_ID
ARG FEATURE_FLAG_KEY
ARG MODE_ANALYTICS_ACCESS_KEY
ARG GOOGLE_API_KEY
ARG HOST
ARG API_URL

ARG TZ=America/Los_Angeles
ARG CI=true

RUN apk update \
	&& apk --no-cache add --virtual builds-deps build-base python 

RUN apk add --no-cache \
	vips-dev fftw-dev libc6-compat git tzdata \
	--update-cache \
	--repository http://dl-cdn.alpinelinux.org/alpine/edge/testing/ \
	--repository http://dl-cdn.alpinelinux.org/alpine/edge/main/

RUN ln -sf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN mkdir /app

WORKDIR /app/

COPY package.json .
COPY package-lock.json .
COPY .npmrc.example .npmrc
COPY .babelrc /app/

RUN npm ci

COPY statics/ /app/statics/
COPY client/ /app/client/
COPY server/ /app/server/
COPY webpack/ /app/webpack/

RUN npm run postinstall

CMD node /app/server/bin/build/server.bundle.js
