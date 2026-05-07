FROM node:20-alpine AS admin-build
WORKDIR /build/admin

COPY admin/package*.json ./
RUN npm ci --no-audit --no-fund

COPY admin/ ./
RUN npm run build

FROM node:20-alpine AS driver-build
WORKDIR /build/driver

COPY driver/package*.json ./
RUN npm ci --no-audit --no-fund

COPY driver/ ./
RUN npm run build

FROM nginx:1.27-alpine
WORKDIR /usr/share/nginx/html

COPY index.html /usr/share/nginx/html/index.html
COPY --from=admin-build /build/admin/dist /usr/share/nginx/html/admin
COPY --from=driver-build /build/driver/dist /usr/share/nginx/html/drivers/dist
COPY nginx.docker.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
