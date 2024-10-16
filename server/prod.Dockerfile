FROM node:18

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

RUN echo "Files in WORKDIR after npm install:" && ls -la

RUN npm run build

EXPOSE 80

ENV NODE_ENV=production

CMD ["npm", "run", "prod"]
