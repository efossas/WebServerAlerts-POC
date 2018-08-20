#!/bin/sh

# install node_modules on host
docker run -itd -v ${PWD}/:/poc --name tmp_wsapoc node
sleep 5
docker exec -it -w /poc tmp_wsapoc npm install
docker stop tmp_wsapoc && docker rm tmp_wsapoc

# 
docker build --no-cache -f Dockerfile -t efossas/wsapoc .
docker-compose up -d
