#!/usr/bin/env bash
set -e

ENV=${1:-mb}
SERVER=${GS_WEB_DEPLOY}
./deploy/build-docker.sh ${ENV}
[ $? -ne 0 ] && echo "Build failure!" && exit 1
RELEASE_DIR_NAME=$(date +%Y%m%d%H%M%S)
RELEASE_DIR="var/app/releases/${RELEASE_DIR_NAME}"
ssh -i ./deploy/mbv-dev-web.pem ${SERVER} "mkdir -p ${RELEASE_DIR}"

rsync -avz --delete -e ssh --progress build/ ${SERVER}:${RELEASE_DIR}
ssh -i ./deploy/mbv-dev-web.pem ${SERVER} "cd var/app/; ln -nfs releases/${RELEASE_DIR_NAME} mbv-front"