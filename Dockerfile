FROM node:alpine

# update, upgrade, & install packages
RUN apk update && apk upgrade
RUN apk add git

# git clone the repo 
RUN git clone https://github.com/efossas/WebServerAlerts-POC /poc

# set working directory
WORKDIR /poc

# install dependencies
RUN npm install --unsafe-perm

# set the command
CMD ["npm","start"]
