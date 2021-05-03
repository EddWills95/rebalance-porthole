# stage1 - build react app first 
FROM node:12-alpine as build-stage

WORKDIR /app

COPY ./package.json /app/
COPY ./yarn.lock /app/

RUN yarn install --production

COPY . /app
RUN yarn build


FROM nginx:1.15
COPY --from=build-stage /app/build/ /usr/share/nginx/html
# Copy the default nginx.conf provided by tiangolo/node-frontend
COPY --from=build-stage /app/nginx.conf /etc/nginx/conf.d/default.conf