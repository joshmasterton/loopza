FROM node:18

WORKDIR /app

COPY package*.json .

RUN NODE_ENV=development npm install

COPY . .

COPY dist ./dist

EXPOSE 80

CMD ["npm", "run", "prod"]
