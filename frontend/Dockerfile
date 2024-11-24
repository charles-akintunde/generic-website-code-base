# FROM node:18 AS builder

# WORKDIR /app

# COPY package*.json ./
# RUN npm install --legacy-peer-deps

# COPY . .

# RUN npm run build

# FROM node:18

# WORKDIR /app

# COPY --from=builder /app/package*.json ./
# COPY --from=builder /app/.next ./.next
# COPY --from=builder /app/public ./public

# RUN npm install --only=production --legacy-peer-deps

# EXPOSE 80

# CMD ["npm", "run", "start", "--", "-p", "80"]


FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 3000

CMD ["npx", "next", "dev", "--experimental-https", "-p", "3000"]
