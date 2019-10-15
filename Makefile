docker-postgres:
	docker-compose up -d --build postgres

docker-frontend:
	docker-compose up -d --build spacemaker-frontend

docker-backend:
	docker-compose up -d --build spacemaker-api

docker:
	docker-compose up -d --build

migrations:
	./spacemaker-backend/postgres/migrate.bash

start: docker-postgres migrations docker-backend docker-frontend

test: docker migrations

.PHONY: docker migrations start
