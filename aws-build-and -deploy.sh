#!/bin/bash

# TODO: 
# create Docker image if not already created
# spin up a Docker container from the docker image
# export the artifact from it to here

# docker build -t aws-exodus-ffmpeg ./docker
# docker run -it --name aws-youtube aws-exodus-ffmpeg /bin/true
# docker container cp aws-youtube:/exodus ./exodus
# docker rm aws-youtube

# TODO: do this in the container, so that it could work also in Windows host environment
rm -f aws-artifact.zip
zip --symlinks --recurse-paths aws-artifact.zip src/ node_modules/ exodus/

# Serverless deploy the built artifact
sls deploy