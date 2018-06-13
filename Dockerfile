# nxtbot by ry00001
# Dockerfile also by ry00001
FROM node:9.11.2-alpine
ENV DOCKER true
COPY . /usr/src/nxtbot
WORKDIR /usr/src/nxtbot
RUN npm i
ENTRYPOINT [ "node", "/usr/src/nxtbot/index.js" ]