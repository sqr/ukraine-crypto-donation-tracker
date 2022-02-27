FROM node:17-alpine3.14

WORKDIR /app

COPY package*.json /app

RUN npm i 

COPY . .

EXPOSE 3001

ENTRYPOINT ["node", "/app/index.js"]
