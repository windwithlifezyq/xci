

FROM node:8.0.0 as nextjscompile
MAINTAINER Joe

RUN mkdir -p /release/web
WORKDIR /release/web

COPY ./  /release/web/

FROM node:8.10.0-slim
MAINTAINER Joe <379163259@qq.com>
RUN apt-get update && apt-get install -y libltdl7

RUN mkdir -p /runDIR/web
WORKDIR /runDIR/web

COPY --from=nextjscompile /release/web /runDIR/web 
RUN cd /runDIR/web && npm install

ENV HOST 0.0.0.0
ENV PORT 3000

EXPOSE 3000
ENTRYPOINT ["npm","start"]
