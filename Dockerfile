FROM iron/node:4

WORKDIR /app
ADD . /app

EXPOSE 3000
ENTRYPOINT ["node", "server.js"]
