## create mysql
(if MAC M1, need --platform linux/x86_64)

docker run --name mysql --platform linux/x86_64 -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=doge_canvas  -p 3310:3306 -d mysql:5.7

## create redis
docker run --name redis_doge -p 6366:6379 -d redis

## build app

## run server
