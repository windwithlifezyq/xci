#!/bin/bash

echo "Start deployment"
WEB_PATH=${PWD}/../autoRelease
cd $WEB_PATH
echo "pulling source code..."

cd ./coder
git reset --hard origin/master
git pull

#npm install
#kill -9 $(lsof -i:3000 |awk '{print $2}' | tail -n 2)
docker build -f ./Dockerfile -t release:node .
docker stop test_node
docker rm test_node
docker run --name test_node -p 3000:3000 release:node
echo "Finished!!!!."






