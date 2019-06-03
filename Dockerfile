FROM node:8-alpine

ARG TZ=America/Los_Angeles
ARG CI=true

RUN apk update \
	&& apk --no-cache add --virtual builds-deps build-base python

RUN apk add --no-cache \
	vips-dev fftw-dev libc6-compat git tzdata \
	--update-cache \
	--repository http://dl-cdn.alpinelinux.org/alpine/edge/testing/ \
	--repository http://dl-cdn.alpinelinux.org/alpine/edge/main/ \
	--repository http://dl-cdn.alpinelinux.org/alpine/edge/community

RUN ln -sf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN mkdir /app

WORKDIR /app/

COPY package.json .
COPY package-lock.json .
COPY .npmrc.example .npmrc
COPY .babelrc /app/

RUN npm ci

COPY statics/ /app/statics/
COPY server/ /app/server/

RUN npm run postinstall

CMD node /app/server/bin/build/server.bundle.js
