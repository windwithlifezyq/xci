#!/bin/bash

echo "Start deployment XCI myself"
git reset --hard origin/master

echo "pulling source code..."
git pull
touch test004.txt

npm install
kill -9 $(lsof -i:3333 |awk '{print $2}' | tail -n 2)
npm run start
echo "Finished."







