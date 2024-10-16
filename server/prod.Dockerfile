FROM node:18

WORKDIR /app

COPY package*.json .

RUN npm install --only=development

COPY . .

RUN npm run build

EXPOSE 80

ENV NODE_ENV=production

CMD ["npm", "run", "prod"]
