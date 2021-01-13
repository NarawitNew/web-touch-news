#!bin/bash

NAME="${PWD##*/}"
docker build -f ./Dockerfile-dev -t $NAME:dev .
