up-server:
	docker-compose up --build

up-db:
	docker-compose -f docker-compose.mysql57.yml up --build


up-pulling:
	docker-compose run --rm cli npm run start:pulling:dev

up-cannon:
	docker-compose run --rm cli node ./load-test/index.js	

bash:
	docker-compose run --rm cli bash


down:
	docker-compose down --remove-orphans

migrate-latest:
	docker-compose run --rm cli knex migrate:latest --env default --knexfile ./db/knexfile

migrate-create:
	docker-compose run --rm cli knex migrate:make $(name) -x ts --knexfile ./db/knexfile

seed-create:
	docker-compose run --rm cli knex seed:make $(name) --knexfile ./db/knexfile

seed-run:
	docker-compose run --rm cli knex seed:run --knexfile ./db/knexfile

mysql:
	docker exec -it concurrency_db57_1 mysql -udb_user -pSecret -Dconcurrency_db

purge-database:
	docker exec -it concurrency_db57_1 mysql -udb_user -pSecret -e "DROP DATABASE IF EXISTS concurrency_db; CREATE DATABASE IF NOT EXISTS concurrency_db;"

recreate-db: purge-database	migrate-latest seed-run








