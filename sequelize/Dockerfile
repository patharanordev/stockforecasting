FROM node:12.4.0-alpine

WORKDIR /app/sequelize

COPY package*.json ./

RUN apk update \
    && apk add --no-cache openssl \
    && apk add tzdata \
    && cp /usr/share/zoneinfo/Asia/Bangkok /etc/localtime \
    && echo "Asia/Bangkok" >  /etc/timezone \
    && npm install

COPY . .

EXPOSE 3002