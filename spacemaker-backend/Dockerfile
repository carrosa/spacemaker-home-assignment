FROM golang:1.13-alpine as base

# Add Maintainer Info
LABEL maintainer="Caroline Sandsbråten (carolinesandsbraten@gmail.com)"

# The latest alpine images don't have some tools like (`git` and `bash`).
# Adding git, bash and openssh to the image
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

WORKDIR /home/spacemaker-api

# Development environment
# Linux alpine doesnt have fswatch by default. We have to make it ourself
FROM base as dev
RUN apk add --no-cache autoconf automake libtool gettext gettext-dev make g++ texinfo curl
WORKDIR /root
RUN wget https://github.com/emcrisostomo/fswatch/releases/download/1.14.0/fswatch-1.14.0.tar.gz
RUN tar -xvzf fswatch-1.14.0.tar.gz
WORKDIR /root/fswatch-1.14.0
RUN ./configure
RUN make
RUN make install

WORKDIR /home/spacemaker-api

