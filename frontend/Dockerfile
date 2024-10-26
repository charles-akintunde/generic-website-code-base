FROM node:18 AS builder

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./

RUN npm install

COPY . .

RUN mkdir -p /app/.next/export /app/.next/server/pages

RUN npm install sharp

RUN npm run build

FROM node:18

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

RUN npm install --only=production

EXPOSE 80

CMD ["npm", "run", "start", "--", "-p", "80"]

# FROM node:18

# WORKDIR /app

# COPY package*.json ./
# RUN npm install

# COPY . .

# EXPOSE 3000

# CMD ["npx", "next", "dev", "--experimental-https", "-p", "3000"]
