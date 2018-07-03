FROM node:8.4

RUN npm install babel-preset-env -g

WORKDIR /tmp
COPY package.json /tmp/

RUN ["npm", "cache", "clear", "--force"]
RUN ["npm", "install"]

RUN mkdir /app
WORKDIR /app/

COPY .babelrc /app/
COPY .sequelizerc /app/
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
COPY iso/ /app/iso/

COPY statics/favicons /app/statics/favicons/
COPY statics/fontawesome /app/statics/fontawesome/
COPY statics/fonts /app/statics/fonts/
COPY statics/images /app/statics/images/
COPY statics/styles /app/static/styles/
COPY statics/clinic.html /app/statics/
COPY statics/electron_index.html /app/statics/
COPY statics/electron_user.html /app/statics/

RUN cp -a /tmp/node_modules /app

RUN ["npm", "run", "postinstall"]

EXPOSE 80

CMD ["node", "server/bin/build/server.bundle.js"]
