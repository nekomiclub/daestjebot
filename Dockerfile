FROM node:25-alpine3.22

WORKDIR /usr/src/app
ENV ISDOCKER=true

# Install dependencies
COPY package*.json ./
RUN npm ci

# Build project
COPY . .
RUN npm run build

# Run
CMD [ "npm", "run", "start" ]