FROM node:12.13.0-buster

RUN npm install -g pm2

WORKDIR /app

EXPOSE 4000

ADD package.json .

RUN npm install

ADD dist ./dist/

ADD ecosystem.config.js .

CMD ["pm2", "start", "--no-daemon"]
