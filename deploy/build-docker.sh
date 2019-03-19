#!/usr/bin/env bash
set -e
ENV="$1"
[[ ! -d build ]] && mkdir build
docker build --file ./deploy/Dockerfile -t gamescripter_web .
docker run --rm -v "$(pwd)"/build:/usr/src/app/build gamescripter_web "${ENV}"