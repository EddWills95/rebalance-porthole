# stage1 - build react app first 
FROM node:12-alpine as build

WORKDIR /app

COPY ./package.json /app/
COPY ./yarn.lock /app/

RUN yarn install --production

COPY . /app
RUN yarn build


FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]