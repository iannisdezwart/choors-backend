FROM node:21-alpine3.19

WORKDIR /app

COPY [ "package.json", "package-lock.json", "tsconfig.json", ".env", "./" ]
COPY ./src ./src

RUN npm install
RUN npm run build

CMD [ "npm", "start" ]
