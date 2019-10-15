#!/usr/bin/env bash

if docker-compose up -d --build postgres; then
  ./postgres/migrate.bash
  docker-compose up --build spacemaker-api
fi

