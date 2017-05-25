#!/bin/bash
# May 22, 2017
# Author: sergey
# Seed the staging db.
# Requires the staging.env file that contains connection information.
# source staging env info and run seeds
source staging.env
node ./server/bin/seeds.js
