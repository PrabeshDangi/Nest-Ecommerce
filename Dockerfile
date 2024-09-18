# FROM node:18 AS build
# WORKDIR /app
# COPY package*.json ./
# RUN npm ci
# COPY . .
# RUN npm run build
# EXPOSE 3000
# CMD ["npm","run","start:dev"]
# FROM node:18 AS build

# WORKDIR /app

# COPY package*.json ./

# RUN npm ci

# COPY . .

# RUN npm run build

# FROM node:18

# WORKDIR /app

# COPY --from=build /app/dist /app/dist
# COPY package*.json ./
# COPY tsconfig.json ./

# EXPOSE 3000

# CMD ["npm", "run", "start:dev"]

FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3000
CMD ["npm", "run", "start:dev"]


