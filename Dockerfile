FROM --platform=$BUILDPLATFORM node:20-alpine as builder
WORKDIR /app
COPY package.json yarn.lock ./
ENV NODE_ENV=production
RUN yarn install --silent --frozen-lockfile
COPY . .
ARG BASE_URL=/
ARG API_URL
ARG GITHUB_CLIENT_ID
RUN VITE_API_URL="${API_URL}" VITE_PUBLIC_URL=${BASE_URL} VITE_GITHUB_CLIENT_ID=${GITHUB_CLIENT_ID} yarn build

FROM --platform=$TARGETPLATFORM nginx:1.25-alpine as app
COPY nginx.conf /etc/nginx/nginx.conf
ARG BASE_URL=/
RUN sed -i "s:\$BASE_URL:$BASE_URL:" /etc/nginx/nginx.conf
COPY --from=builder /app/dist /usr/share/nginx/html/
