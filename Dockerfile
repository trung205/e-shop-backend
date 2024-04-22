FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

COPY src/modules/prisma/ ./src/modules/prisma/

RUN yarn

COPY . .

# RUN yarn migrate-deploy

# RUN yarn generate-prisma

# RUN yarn build

CMD [ "yarn", "start:dev" ]