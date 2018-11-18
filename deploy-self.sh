#!/bin/bash

WEB_PATH='./'

echo "Start deployment"
cd $WEB_PATH
echo "pulling source code..."
#git reset --hard origin/master
git pull
#git checkout master
npm install
######npm run start
echo "Finished."