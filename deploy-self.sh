#!/bin/bash

echo "Start restart XCI server"
kill -9 $(lsof -i:3333 |awk '{print $2}' | tail -n 2)
npm run start
echo "Finished."







