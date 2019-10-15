#!/usr/bin/env bash

CONTAINER_NAME="spacemakerdb"

# Delete and create new DB
docker exec -it ${CONTAINER_NAME} psql -U postgres -c "DROP DATABASE IF EXISTS spacemakerdb"
docker exec -it ${CONTAINER_NAME} psql -U postgres -c "CREATE DATABASE spacemakerdb"

# Create tables
docker exec -it ${CONTAINER_NAME} psql -U postgres -c "\i /postgres/sql/schema.pgsql"

# Create test data
sleep 2
docker exec -it ${CONTAINER_NAME} psql -U postgres -c "\i /postgres/sql/populate_geojson.pgsql"
