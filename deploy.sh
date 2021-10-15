#!/usr/bin/env bash

echo "    ____             __           "
echo "   / __ \___  ____  / /___  __  __"
echo "  / / / / _ \/ __ \/ / __ \/ / / /"
echo " / /_/ /  __/ /_/ / / /_/ / /_/ / "
echo "/_____/\___/ .___/_/\____/\__, /  "
echo "          /_/            /____/   "

echo BUILDING DOCKER IMAGE
echo "$DOCKERHUB_PASS" | docker login --username vorwahlen --password-stdin
docker build -t frontend .
docker tag frontend vorwahlen/frontend:latest
docker push vorwahlen/frontend

echo "Image has been uploaded to Docker Hub."

