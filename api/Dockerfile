FROM nikolaik/python-nodejs:python3.6-nodejs12-slim

WORKDIR /api

COPY ./package.json /api/
COPY ./yarn.lock /api/

RUN yarn install --production

COPY . /api/

RUN ls

RUN pip install -r /api/rebalance-py/requirements.txt 

CMD ["node", "index.js"]