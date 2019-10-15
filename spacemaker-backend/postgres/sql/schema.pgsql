\c spacemakerdb

CREATE TABLE IF NOT EXISTS  geojson (
  id serial NOT NULL PRIMARY KEY,
  geojson text NOT NULL
);
