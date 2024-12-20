FROM node:18

WORKDIR /app

COPY server/package*.json .

RUN npm install

COPY server/. .

RUN npm run build

EXPOSE 80

ENV NODE_ENV=production

CMD ["npm", "run", "prod"]
