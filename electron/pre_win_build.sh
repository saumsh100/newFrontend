#!/bin/bash

echo "Doing pre-hook"
mkdir tmp
echo $PWD
mv  ./electron/node_modules/robotjs/build tmp/build
cp -R ./electron/robot-build-win/* ./electron/node_modules/robotjs/
mv ./electron/node_modules/robotjs/binding.gyp tmp/
