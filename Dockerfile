FROM node:22.4.1-alpine

WORKDIR /app

COPY . .

CMD node ./dist/main.js
