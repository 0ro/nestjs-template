FROM node:16-alpine

WORKDIR /app

COPY ["package.json", "package-lock.json", "./"]

RUN apk add g++ make py3-pip
RUN npm install

CMD ["npm", "run", "start:debug"]
