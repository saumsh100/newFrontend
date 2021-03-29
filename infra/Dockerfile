FROM public.ecr.aws/carecru/docker-images:node-14.15.1-alpine as builder

ARG TZ=America/Los_Angeles
ARG NPM_TOKEN
ARG FEATURE_FLAG_KEY
ARG GOOGLE_API_KEY
ARG INTERCOM_APP_ID
ARG API_SERVER_HOST
ARG WORKFLOW_HOST

ENV PATH /app/node_modules/.bin:$PATH
ENV POLLING_FOLLOWUP_INTERVAL=300 \
	POLLING_SCHEDULE_INTERVAL=300 \
	POLLING_REVENUE_INTERVAL=300 \
	POLLING_VWR_INTERVAL=60 \
	POLLING_UNREAD_CHAT_INTERVAL=300 \
	REGION=CA \
	DEBUG=false \
	SOURCE=true \
	API_SERVER_PORT=80 \
	USE_LOCAL_BACKEND=false

RUN apk add --no-cache --virtual builds-deps build-base python tzdata \
	--update-cache \
	--repository http://dl-cdn.alpinelinux.org/alpine/v3.10/testing/ \
	--repository http://dl-cdn.alpinelinux.org/alpine/v3.10/main/ \
	--repository http://dl-cdn.alpinelinux.org/alpine/v3.10/community
RUN ln -sf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN mkdir /app
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run client:build:isolated

# Deploy build to NGINX
FROM public.ecr.aws/carecru/docker-images:nginx-1.17.10-alpine
COPY --from=builder /app/server/dist /usr/share/nginx/html
COPY infra/nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
