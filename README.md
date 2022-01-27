#i canvas_demo
## Description
Real time website, login, register, create and move comment, move image
## Skill
express, vue, mysql, redis, passport, socket.io, sequelize, jest

## create mysql
(if MAC M1, need --platform linux/x86_64)

docker run --name mysql --platform linux/x86_64 -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=doge_canvas  -p 3310:3306 -d mysql:5.7

## create redis
docker run --name redis_doge -p 6366:6379 -d redis


<br/>

## How to run local (Separately start the front-end and back-end)
Please watch `README.md` in `server` and `app` folders

<br/>

## How to run local (docker)

```sh
docker build -t canvas_demo .

docker run -d -p 3000:3000 \
  -e NODE_ENV="production" \
  -e DB_HOST=192.168.2.137 \
  -e DB_PORT="3310" \
  -e DB_SCHEMA="doge_canvas" \
  -e DB_USER_NAME="root" \
  -e DB_PASSWORD="password" \
  -e REDIS_HOST=192.168.2.137 \
  -e REDIS_PORT="6366" \
  -e sessionSecret="aaaa" \
  -e sessionTTL="86400" \
  -e redisTTL=120 \
  --name canvas_demo canvas_demo
```

<br/>

## demo
waiting gif upload
