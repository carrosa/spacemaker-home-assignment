FROM postgres:12
LABEL maintainer="Caroline Sandsbråten <carolinesandsbraten@gmail.com>"

ENV POSTGRES_DB spacemakerdb

RUN mkdir -p postgres/sql

COPY postgres/sql/*.pgsql /postgres/sql/

