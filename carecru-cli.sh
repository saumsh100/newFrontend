#!/bin/bash

initialize() {
	echo "Initializing Development Environment"
	dockerComposeUp
	redoSeeds
	serverWatch
	clientDevServer
	[ $? != 0 ] && echo "Failed to Initialize Development Environment" && exit 1
	echo "Initialization Complete"
}

start() {
	echo "Starting Development Environment"
	dockerComposeUp
	serverWatch
	clientDevServer
	[ $? != 0 ] && echo "Failed to Start-up Development Environment" && exit 1
	echo "Start-up Complete"
}

stop() {
	echo "Killing Development Environment"
	docker-compose kill
	[ $? != 0 ] && echo "Failed to Kill Development Environment" && exit 1
}

console() {
	echo "Opening Bash Console to carecru_web"
	docker exec -it $(docker ps -q --filter ancestor=carecru_web:development) bash
	[ $? != 0 ] && echo "Failed to Open Bash Console to carecru_web" && exit 1
}

log() {
	echo "Tailing logs for: $1"
	docker logs -f $(docker ps -q --filter ancestor=$1)
}

dockerComposeUp() {
	echo "Starting up Docker Containers"
	docker-compose up -d
	[ $? != 0 ] && echo "Failed to Run docker-compose up" && exit 1
}

serverWatch() {
	echo "Opening Server Watch"
	if [[ $(uname -a) == *"Linux"* ]]; then
		gnome-terminal -- sh -c "docker exec -it $(docker ps -q --filter ancestor=carecru_web:development) npm run server:watch; read"
		[ $? != 0 ] && echo "Failed to Open Server Watch" && exit 1
	elif [[ $(uname -a) == *"Darwin"* ]]; then
		open watch_server.command
		[ $? != 0 ] && echo "Failed to Open Server Watch" && exit 1
	fi
}

clientDevServer() {
	echo "Opening Client Dev Server"
	if [[ $(uname -a) == *"Linux"* ]]; then
		gnome-terminal -- sh -c "docker exec -it $(docker ps -q --filter ancestor=carecru_web:development) npm run client:dev:server; read"
		[ $? != 0 ] && echo "Failed to Open Client Dev Server" && exit 1
	elif [[ $(uname -a) == *"Darwin"* ]]; then
		open client_dev_server.command
		[ $? != 0 ] && echo "Failed to Open Client Dev Server" && exit 1
	fi
}

redoSeeds() {
	echo "Running Seeds and Migrations"
	docker exec -it $(docker ps -q --filter ancestor=carecru_web:development) sequelize db:migrate:undo:all
	docker exec -it $(docker ps -q --filter ancestor=carecru_web:development) sequelize db:migrate
	docker exec -it $(docker ps -q --filter ancestor=carecru_web:development) sequelize db:seed:all
	[ $? != 0 ] && echo "Failed to Run Seeds and Migrations" && exit 1
}

createMigration() {
	echo "Creating Migration $1"
	docker exec -it $(docker ps -q --filter ancestor=carecru_web:development) sequelize migration:create --name $1
	[ $? != 0 ] && echo "Failed to Create Migration $1" && exit 1
}

runMigrations() {
	echo "Running Migrations"
	docker exec -it $(docker ps -q --filter ancestor=carecru_web:development) sequelize db:migrate
	[ $? != 0 ] && echo "Failed to Run Migrations" && exit 1
}

undoMigrations() {
	echo "Undoing Migrations"
	docker exec -it $(docker ps -q --filter ancestor=carecru_web:development) sequelize db:migrate:undo
	[ $? != 0 ] && echo "Failed to Undo Migrations" && exit 1
}

$*