FROM --platform=$BUILDPLATFORM node:20-alpine as builder
WORKDIR /app
COPY package.json yarn.lock ./
ENV NODE_ENV=production
RUN yarn install --silent --frozen-lockfile
COPY . .
ARG BASE_PATH=/
ARG API_URL
ARG GITHUB_CLIENT_ID
ARG ENABLE_GUEST
RUN VITE_ENABLE_GUEST=${ENABLE_GUEST} VITE_API_URL="${API_URL}" VITE_BASE_PATH=${BASE_PATH} VITE_GITHUB_CLIENT_ID=${GITHUB_CLIENT_ID} yarn build

FROM --platform=$TARGETPLATFORM nginx:1.25-alpine as app
COPY nginx.conf /etc/nginx/nginx.conf
ARG BASE_PATH=/
RUN sed -i "s:\$BASE_PATH:$BASE_PATH:" /etc/nginx/nginx.conf
COPY --from=builder /app/dist /usr/share/nginx/html/
