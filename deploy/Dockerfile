FROM kkarczmarczyk/node-yarn:latest

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json .
COPY yarn.lock .
RUN yarn install

COPY . /usr/src/app
VOLUME /usr/src/app/build

ENTRYPOINT ["sh", "./deploy/build-entrypoint.sh"]
