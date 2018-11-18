#!/bin/bash

WEB_PATH='/opt/install/'
TARGET_PATH = $WEB_PATH/autoRelease/
echo "Start deployment"
cd $TARGET_PATH
echo "pulling source code..."
#git reset --hard origin/master
git clone https://github.com/windwithlife/coder.git
cd ./coder
#git checkout master
npm install
npm run dev
######npm run start
echo "Finished."