FROM node:lts-bullseye as build-stage
WORKDIR /app
ARG VUE_APP_SERVER_URL
ENV VUE_APP_SERVER_URL=$VUE_APP_SERVER_URL
COPY package*.json ./
RUN npm install
COPY ./ .
RUN npm run build

FROM nginx as production-stage
RUN mkdir /app
COPY --from=build-stage /app/dist /app
COPY nginx.conf /etc/nginx/nginx.conf