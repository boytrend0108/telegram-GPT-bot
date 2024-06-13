FROM node

WORKDIR /app

COPY package*.json ./

RUN npm ci

RUN npm install cross-env

COPY . .

ENV PORT=3000

EXPOSE ${PORT}

CMD ["npm", "start"]