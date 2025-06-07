FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN chown -R node:node .

COPY . .

EXPOSE 3001

CMD [ "npm", "start" ] 