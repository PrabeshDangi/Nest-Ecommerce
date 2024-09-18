FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY . .
RUN npm install
# ENV PORT=3000
EXPOSE 3000

RUN npx prisma generate

CMD ["npm", "run", "start:dev"]