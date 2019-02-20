#!/bin/bash

# remove current artifact
rm -f aws-artifact.zip

# create Docker image
docker build -t aws-exodus-ffmpeg ./ffmpeg

# spin up a Docker container from the image and mount the local ./src and ./node_modules folders,
# and keep it alive/running by either:
# 1. run "/bin/bash" as deamon -d, but attach TTY -t to it , otherwise "bash" will exit
# when it's not connected to a terminal and has nothing to run
docker run -td -v `pwd`/src:/app/src -v `pwd`/node_modules:/app/node_modules --name aws-youtube aws-exodus-ffmpeg
# 2. run "sleep infinity" as the container's command.
# docker run -d -v `pwd`/src:/app/src -v `pwd`/node_modules:/app/node_modules --name aws-youtube aws-exodus-ffmpeg sleep infinity

# create an aws-artifact , e.g zip inside the container the needed folders
docker exec -w /app aws-youtube zip --symlinks --recurse-paths aws-artifact.zip src/ node_modules/ exodus/

# copy the created artifact from the container to the host
docker container cp aws-youtube:/app/aws-artifact.zip .

# remove the container
docker rm -f aws-youtube

# Serverless deploy the built artifact
sls deploy