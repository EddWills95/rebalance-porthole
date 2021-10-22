# FROM nikolaik/python-nodejs:python3.6-nodejs12-slim
FROM node:16-slim

RUN apt update && apt install -y
RUN apt install git python3 python3-pip -y 

RUN yarn global add pm2

# Create app directory
WORKDIR /usr/src/app

# Do python stuff
RUN git clone https://github.com/C-Otto/rebalance-lnd.git
RUN pip3 install -r rebalance-lnd/requirements.txt

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package.json ./
COPY yarn.lock ./

RUN yarn install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 3001
CMD [ "pm2-runtime", "index.js" ]