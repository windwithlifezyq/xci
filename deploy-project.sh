#!/bin/bash

echo "Start deployment"
WEB_PATH=${PWD}/../autoRelease
cd $WEB_PATH
echo "pulling source code..."

#git clone https://github.com/windwithlife/coder.git
cd ./coder
git reset --hard origin/master
git pull
#git checkout master
npm install
kill -9 $(lsof -i:3000 |awk '{print $2}' | tail -n 2)
npm run devx
echo "Finished!!!!."






