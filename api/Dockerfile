FROM nikolaik/python-nodejs:python3.6-nodejs12-slim

WORKDIR /api

COPY ./package.json /api/
COPY ./yarn.lock /api/

RUN yarn install --production

RUN git clone https://github.com/C-Otto/rebalance-lnd.git

COPY . /api/

RUN pip install -r /api/rebalance-py/requirements.txt 

CMD ["node", "index.js"]