#!bin/bash

NAME="${PWD##*/}"
docker build -f ./Dockerfile-sit -t $NAME:sit .