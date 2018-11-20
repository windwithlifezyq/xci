#!/bin/bash

echo "Start deployment"
WEB_PATH=${PWD}/../autoRelease
cd $WEB_PATH
echo "git clone pulling source code..."
git clone https://github.com/windwithlife/coder.git
cd ./coder
npm install
kill -9 $(lsof -i:3000 |awk '{print $2}' | tail -n 2)
touch .git/cloneflag.flag

echo "Finished!!!!."






