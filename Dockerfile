FROM node:23

WORKDIR /app

COPY package*.json .

RUN npm install

RUN npx prisma init

COPY . .

CMD ["sh", "-c", "npx prisma migrate dev && npm run start"]