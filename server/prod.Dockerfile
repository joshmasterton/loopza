FROM node:18

WORKDIR /app

COPY ./dist ./dist

COPY package*.json .

RUN npm ci

EXPOSE 80

CMD ["npm", "run", "prod"]
