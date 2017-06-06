#!/bin/bash
# Date: May 22, 2017
# Author: sergey
#
# Runs tmux with three panes that each run part of the application in
# development environment.

TMUX_SESSION=server

tmux new-session -d -s ${TMUX_SESSION} 'npm start'
tmux split-window -v 'sleep 2 && npm run server:watch'
tmux split-window -h 'sleep 2 && npm run client:dev:server'
tmux -2 attach-session -d -t ${TMUX_SESSION}
