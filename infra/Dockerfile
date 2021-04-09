FROM public.ecr.aws/carecru/docker-images:node-14.15.1-alpine as builder

ARG TZ=America/Los_Angeles
ARG NPM_TOKEN
ARG FEATURE_FLAG_KEY
ARG GOOGLE_API_KEY
ARG INTERCOM_APP_ID
ARG API_SERVER_HOST
ARG API_SERVER_PORT
ARG WORKFLOW_HOST
ARG MY_SUBDOMAIN
ARG MODE_ANALYTICS_ACCESS_KEY
ARG LIVESESSION_ID
ARG EXECUTION_ENVIRONMENT

ENV PATH /app/node_modules/.bin:$PATH
ENV POLLING_FOLLOWUP_INTERVAL=300 \
	POLLING_SCHEDULE_INTERVAL=300 \
	POLLING_REVENUE_INTERVAL=300 \
	POLLING_VWR_INTERVAL=60 \
	POLLING_UNREAD_CHAT_INTERVAL=300 \
	REGION=CA \
	DEBUG=false \
	SOURCE=true \
	USE_LOCAL_BACKEND=false

RUN apk add --no-cache --virtual builds-deps build-base python tzdata \
	--update-cache \
	--repository http://dl-cdn.alpinelinux.org/alpine/v3.10/testing/ \
	--repository http://dl-cdn.alpinelinux.org/alpine/v3.10/main/ \
	--repository http://dl-cdn.alpinelinux.org/alpine/v3.10/community

RUN mkdir /app
WORKDIR /app

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
COPY .npmrc.example .npmrc
RUN npm ci

# add app
COPY . ./

# build
RUN npm run client:build

# Deploy only the build with Express Server
FROM public.ecr.aws/carecru/docker-images:node-14.15.1-alpine

ENV PATH /app/node_modules/.bin:$PATH
RUN ln -sf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN mkdir /app
WORKDIR /app
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/node_modules /app/node_modules

EXPOSE 80
CMD node /app/dist/server.bundle.js
