docker:
	docker-compose up -d --build
migrations:
	./spacemaker-backend/postgres/migrate.bash
start: docker migrations
