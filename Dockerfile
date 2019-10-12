FROM node:10.15.3

RUN mkdir /app
WORKDIR /app

COPY . /app

RUN npm install

RUN npm run build

EXPOSE 3000

CMD ["node", "-r", "tsconfig-paths/register", "./dist/main.js"]
