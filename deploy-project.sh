#!/bin/bash

echo "Start deployment"
WEB_PATH='/Users/ctrip/'
TARGET_PATH = $WEB_PATH/autoRelease/

cd $TARGET_PATH
touch test.txt
echo "pulling source code..."
#git reset --hard origin/master
#git clone https://github.com/windwithlife/coder.git
#cd ./coder
#git checkout master
#npm install
#npm run dev
######npm run start
echo "Finished."