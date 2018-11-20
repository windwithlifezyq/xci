#!/bin/bash

echo "Start deployment"
WEB_PATH=${PWD}/../autoRelease
cd $WEB_PATH
echo "git clone pulling source code..."
git clone https://github.com/windwithlife/coder.git
cd ./coder

#kill -9 $(lsof -i:3000 |awk '{print $2}' | tail -n 2)
docker build -f ./Dockerfile -t release:node .
docker stop test_node
docker rm test_node
docker run -d --name test_node -p 3000:3000 release:node

cd ./files/server/simpleserver/
docker build -f ./Dockerfile -t release:java .
docker stop test_java_server
docker rm test_java_server
docker run -d --name test_java_server -p 8080:8080 release:java


#kill -9 $(lsof -i:3000 |awk '{print $2}' | tail -n 2)
echo "Finished!!!!."






