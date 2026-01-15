FROM node:22.16-alpine

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

COPY entrypoint.sh .

RUN chmod +x entrypoint.sh

EXPOSE 5000

ENTRYPOINT ["./entrypoint.sh"]