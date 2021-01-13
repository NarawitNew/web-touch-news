#!bin/bash

NAME="${PWD##*/}"
docker build -f ./Dockerfile-prod -t $NAME:prod .