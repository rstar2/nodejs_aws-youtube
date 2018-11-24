#!/bin/bash

rm -f aws-artifact.zip
zip --symlinks --recurse-paths aws-artifact.zip src/ node_modules/ exodus/

exec "$@"