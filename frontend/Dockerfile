# Tahap 1: Build
FROM node:20-alpine AS build
WORKDIR /app

# Copy package dulu biar cepat
COPY package*.json ./
RUN npm install

# Copy semua file
COPY . .

# Tambahkan baris ini untuk memastikan folder dist bersih sebelum build
RUN CI=true npm run build

# Tahap 2: Nginx
FROM nginx:stable-alpine
# Copy hasil build ke folder Nginx
COPY --from=build /app/dist /usr/share/nginx/html
# Copy custom config nginx (Opsional, tapi biar aman)
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]