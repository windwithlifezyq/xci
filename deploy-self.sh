#!/bin/bash

echo "Start deployment XCI myself"
npm install
kill -9 $(lsof -i:3333 |awk '{print $2}' | tail -n 2)
npm run start
echo "Finished."







