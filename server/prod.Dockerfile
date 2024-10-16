FROM node:18

WORKDIR /app

COPY package*.json .

RUN NODE_ENV=development npm install

COPY . .

RUN npm run build

EXPOSE 80

CMD ["node", "dist/src/app.js"]
