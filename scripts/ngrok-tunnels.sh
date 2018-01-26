#!/bin/bash

CODEROOT=$1

bash -c "ttab 'nvm use 8.4 ; cd ${CODEROOT} ; php -S localhost:5555'"
bash -c "ttab 'nvm use 8.4 ; ngrok http --hostname \"*.carecru.me\" 5100'"
bash -c "ttab 'nvm use 8.4 ; ngrok http --hostname carecru.ngrok.io 5555'"
