
FROM node:8.10.0-slim

MAINTAINER Joe <379163259@qq.com>
RUN apt-get update && apt-get install -y libltdl7

ENTRYPOINT ["kubectl","get","pods"]



