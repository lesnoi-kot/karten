FROM node:20-alpine as builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --silent --frozen-lockfile
COPY . .
RUN yarn build

FROM --platform=$TARGETPLATFORM nginx:1.25-alpine as app
COPY nginx.conf /etc/nginx/nginx.conf
ARG BASE_URL=/
RUN sed -i "s:\$BASE_URL:$BASE_URL:" /etc/nginx/nginx.conf
COPY --from=builder /app/dist /usr/share/nginx/html/
