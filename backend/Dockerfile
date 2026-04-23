# Gunakan image Node.js versi 18
FROM node:20-alpine

# Set folder kerja di dalam kontainer
WORKDIR /app

# Copy package.json dan install library
COPY package*.json ./
RUN npm install

# Copy semua file backend ke kontainer
COPY . .

# Backend kamu jalan di port 5050
EXPOSE 5050

# Jalankan server
CMD ["node", "index.js"]