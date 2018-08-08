#!/bin/bash

initialize() {
	echo "Initializing Development Environment"
	dockerComposeUp
	redoSeeds
	serverWatch
	clientDevServer
	echo "Initialization Complete"

	[ $? != 0 ] && error "Failed to Initialize Development Environment" && exit 101
}

start() {
	echo "Starting Development Environment"
	dockerComposeUp
	serverWatch
	clientDevServer
	echo "Start-up Complete"

	[ $? != 0 ] && error "Failed to Start-up Development Environment" && exit 101
}

stop() {
	echo "Killing Development Environment"
	docker-compose kill

	[ $? != 0 ] && error "Failed to Kill Development Environment" && exit 101
}

console() {
	echo "Opening Bash Console to carecru_web"
	docker exec -it $(docker ps -q --filter ancestor=carecru_web:development) bash

	[ $? != 0 ] && error "Failed to Open Bash Console to carecru_web" && exit 101
}

log() {
	echo "Tailing logs for: $1"
	docker logs -f $(docker ps -q --filter ancestor=$1)
}

dockerComposeUp() {
	echo "Starting up Docker Containers"
	docker-compose up -d

	[ $? != 0 ] && error "Failed to Run docker-compose up" && exit 101
}

serverWatch() {
	echo "Opening Server Watch"
	open watch_server.command

	[ $? != 0 ] && error "Failed to Open Server Watch" && exit 101
}

clientDevServer() {
	echo "Opening Client Dev Server"
	open client_dev_server.command

	[ $? != 0 ] && error "Failed to Open Client Dev Server" && exit 101
}

redoSeeds() {
	echo "Running Seeds and Migrations"
	docker exec -it $(docker ps -q --filter ancestor=carecru_web:development) sequelize db:migrate:undo:all

	docker exec -it $(docker ps -q --filter ancestor=carecru_web:development) sequelize db:migrate

	docker exec -it $(docker ps -q --filter ancestor=carecru_web:development) sequelize db:seed:all

	[ $? != 0 ] && error "Failed to Run Seeds and Migrations" && exit 101
}

createMigration() {
	echo "Creating Migration $1"
	docker exec -it $(docker ps -q --filter ancestor=carecru_web:development) sequelize migration:create --name $1

	[ $? != 0 ] && error "Failed to Create Migration $1" && exit 101
}

runMigrations() {
	echo "Running Migrations"
	docker exec -it $(docker ps -q --filter ancestor=carecru_web:development) sequelize db:migrate

	[ $? != 0 ] && error "Failed to Run Migrations" && exit 101
}

undoMigrations() {
	echo "Undoing Migrations"
	docker exec -it $(docker ps -q --filter ancestor=carecru_web:development) sequelize db:migrate:undo

	[ $? != 0 ] && error "Failed to Undo Migrations" && exit 101
}

$*