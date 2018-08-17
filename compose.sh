#!/bin/sh

docker build --no-cache -f Dockerfile -t efossas/wsapoc .
docker-compose -p wsapoc up -d
