REGISTRY=reg.plagiari.sm
PROJECT=covid-19
TAG=`cat VERSION`

REG_PROJ=$(REGISTRY)/$(PROJECT)
REG_TAG=$(REGISTRY)/$(PROJECT):$(TAG)

build:
	yarn build

docker:
	docker build -t $(REG_TAG) .

docker-latest: docker
	docker tag $(REG_TAG) $(REG_PROJ):latest

docker-push:
	docker push $(REG_TAG)

docker-push-latest:
	docker push $(REG_PROJ):latest

deploy: build docker docker-push

