FROM public.ecr.aws/carecru/docker-images:node-14.17.4-alpine3.14 as builder

ARG TZ=America/Los_Angeles
ARG NPM_TOKEN
ARG FORT_AWESOME_NPM_TOKEN
ARG FEATURE_FLAG_KEY
ARG GOOGLE_API_KEY
ARG INTERCOM_APP_ID
ARG API_SERVER
ARG WORKFLOW_HOST
ARG FORMS_HOST
ARG CHAT_HOST
ARG ENTERPRISE_MANAGEMENT_HOST
ARG MY_SUBDOMAIN
ARG MODE_ANALYTICS_ACCESS_KEY
ARG LIVESESSION_ID
ARG EXECUTION_ENVIRONMENT
ARG PORT

ENV PATH /app/node_modules/.bin:$PATH
ENV POLLING_FOLLOWUP_INTERVAL=300 \
	POLLING_SCHEDULE_INTERVAL=300 \
	POLLING_REVENUE_INTERVAL=300 \
	POLLING_VWR_INTERVAL=60 \
	POLLING_UNREAD_CHAT_INTERVAL=300 \
	REGION=CA \
	DEBUG=false \
	SOURCE=true

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
FROM public.ecr.aws/carecru/docker-images:node-14.17.4-alpine3.14

ENV PATH /app/node_modules/.bin:$PATH
RUN ln -sf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN mkdir /app
WORKDIR /app
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/node_modules /app/node_modules

EXPOSE 80
CMD node /app/dist/server.bundle.js
