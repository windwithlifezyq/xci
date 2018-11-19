#!/bin/bash

echo "Start deployment"
WEB_PATH=${PWD}/../autoRelease
echo $WEB_PATH
TARGET_PATH=${WEB_PATH}
echo $WEB_PATH
cd $WEB_PATH
touch test003.txt
echo "pulling source code..."
#git reset --hard origin/master
git clone https://github.com/windwithlife/coder.git
cd ./coder
touch testx.txt
#git checkout master
#npm install
#npm run dev
######npm run start
echo "Finished."






