FROM node:buster-slim

ENV TZ=Asia/Bangkok
WORKDIR /app/normalize

COPY package*.json ./

RUN apt-get update \
    && apt-get install -y build-essential \
       wget python3 make gcc libc6-dev \
    && ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone \
    && npm install

COPY . .

EXPOSE 3000