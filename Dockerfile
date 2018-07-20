# Tuxedo Dockerfile
# Copyright (c) ry00001

FROM node:9.11.2-alpine

LABEL maintainer="ry00001 <ry00001@protonmail.com>"

RUN apk update && \
    apk upgrade && \
    mkdir -p /usr/src/tux && \
    chown -R node:root /usr/src/tux && \
    chmod g+rw /usr && \
    chgrp root /usr && \
    find /home/node -type d -exec chmod g+x {} +

ENV DOCKER true

COPY . /usr/src/tux

WORKDIR /usr/src/tux

USER 1000

RUN yarn install

ENTRYPOINT [ "node", "/usr/src/tux/index.js" ]