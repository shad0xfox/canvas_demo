FROM node:14-alpine

RUN apk add --no-cache --virtual .gyp \
        python \
        make \
        g++

COPY app/package.json /tmp/app/package.json
COPY server/package.json /tmp/server/package.json

RUN cd /tmp/app && npm install
RUN cd /tmp/server && npm install --production && apk del .gyp

RUN mkdir -p /opt/app && cp -a /tmp/app/node_modules /opt/app/
RUN mkdir -p /opt/server && cp -a /tmp/server/node_modules /opt/server/

COPY app /opt/app
RUN cd /opt/app && npm run build

RUN cp -r /opt/app/dist /opt/server/public && rm -rf /opt/app

WORKDIR "/opt/server"
COPY server /opt/server

EXPOSE 3000
CMD ["node","src/bin/server.js"]
