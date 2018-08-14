#!/bin/bash

echo "Doing post-hook"
mv -f tmp/build ./electron/node_modules/robotjs/build
mv tmp/binding.gyp ./electron/node_modules/robotjs/
rm -rf tmp
