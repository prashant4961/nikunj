# syntax=docker/dockerfile:1

FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Empty VITE_API_URL keeps API calls same-origin so nginx can proxy them.
ARG VITE_API_URL=""
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

FROM nginx:1.27-alpine AS runtime
ENV BACKEND_ORIGIN=http://backend:4000
# Only substitute BACKEND_ORIGIN so nginx variables like $host survive envsubst
ENV NGINX_ENVSUBST_FILTER=BACKEND_ORIGIN
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
