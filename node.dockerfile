# docker network create --driver bridge covidapp_network
# docker run -d --net=covidapp_network  --name mongodb mongo
# then update data/db in Kitematic and set PUBLISHED IP Port to 27017
#




FROM node:12

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8000

CMD ["npm", "start"]