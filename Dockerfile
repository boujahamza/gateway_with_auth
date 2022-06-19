# syntax=docker/dockerfile:1

FROM node:stretch-slim
ENV NODE_ENV=production

##ENV ARTICLE_URL 'http://localhost:3000'
##ENV FEED_URL "http://localhost:4005"
##ENV GAME_URL "http://localhost:4001"
##ENV STREAM_URL "http://localhost:4006"
##ENV USER_INFOS_URL "http://localhost:4003"
ENV TOKEN_KEY: "hglsjg"

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --production

COPY . .

CMD [ "node", "server.js" ]
