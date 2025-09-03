FROM node:23.11.1-slim

WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

COPY . .

ENV ISDOCKER=true

# Run
CMD [ "npm", "run", "start" ]