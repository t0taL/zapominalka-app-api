FROM node:10
WORKDIR /zapominalka-api
COPY ./package*.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "start"]