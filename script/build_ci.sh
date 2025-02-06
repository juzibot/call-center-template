#!/usr/bin/env bash
set -e

imageName=$IMAGE_NAME
ECR_URL=789252305933.dkr.ecr.cn-northwest-1.amazonaws.com.cn

IMAGE_TAG="$PACKAGE_VERSION"

echo current package version: "$PACKAGE_VERSION"

echo "Checking if image $ECR_URL/$imageName:$IMAGE_TAG already exists..."
if aws ecr describe-images --repository-name $imageName --image-ids imageTag=$IMAGE_TAG >/dev/null 2>&1; then
  echo "Image $ECR_URL/$imageName:$IMAGE_TAG already exists. Exiting."
  exit 2
fi

npm run build

aws ecr get-login-password | docker login --username AWS --password-stdin $ECR_URL

echo docker buildx build --platform linux/$ARCH --build-arg ARCH=$ARCH --build-arg PACKAGE_VERSION=$PACKAGE_VERSION --provenance false --sbom false -t "$ECR_URL"/"$imageName":"$IMAGE_TAG" -f Dockerfile . --push
docker buildx build --platform linux/$ARCH --build-arg ARCH=$ARCH --build-arg PACKAGE_VERSION=$PACKAGE_VERSION --provenance false --sbom false -t "$ECR_URL"/"$imageName":"$IMAGE_TAG" -f Dockerfile . --push
