docker exec -it $(docker ps -q --filter ancestor=carecru_web:development) npm run client:dev:server