#!/usr/bin/env bash
set -e
if [ "$1" = 'yarn' ]; then
  "$@"
  exit 0
fi
ENV="$1"
if [ -z "$ENV" ]; then
    yarn build
    exit 0
fi
echo "Building for environment: ${ENV}"
yarn build:${ENV}
exit 0
