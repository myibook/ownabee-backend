#!/bin/bash
if [ $# -eq 0 ]
  then
    echo "No arguments supplied. Please enter env(dev/prod) as the first argument"
    exit 1
fi
env=$1 #first argument si env
if [ $env = "prod" ]
  then
    tag="prod"
    service_name="backend-service"
else
    tag="dev"
    service_name="backend-beta-service-85sarjkn"
fi
echo "Deplying to $tag"
# aws --profile ownabee ecr get-login-password --region ap-northeast-2 | docker login --username AWS --password-stdin 428207184058.dkr.ecr.ap-northeast-2.amazonaws.com
aws ecr get-login-password --region ap-northeast-2 | docker login --username AWS --password-stdin 428207184058.dkr.ecr.ap-northeast-2.amazonaws.com
# docker build . -t  049325257821.dkr.ecr.us-east-2.amazonaws.com/backend:$tag
# use following for m2 chips
docker buildx build --platform=linux/amd64 . --no-cache -t   428207184058.dkr.ecr.ap-northeast-2.amazonaws.com/ownabee/backend:$tag
docker push 428207184058.dkr.ecr.ap-northeast-2.amazonaws.com/ownabee/backend:$tag

# aws --profile ownabee ecs update-service --cluster backend --service  $service_name --force-new-deployment --region ap-northeast-2

aws ecs update-service --cluster ownabee --service  $service_name --force-new-deployment --region ap-northeast-2
