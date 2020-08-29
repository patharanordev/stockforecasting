FROM node:buster-slim

WORKDIR /app/fetcher

COPY package*.json ./

RUN apt-get update \
    && apt-get install -y build-essential \
       wget python3 make gcc libc6-dev \
    && ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone \
    && npm install

COPY . .

EXPOSE 3001