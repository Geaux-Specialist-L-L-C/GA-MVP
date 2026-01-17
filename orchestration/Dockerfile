FROM node:20-alpine AS build

WORKDIR /app
ENV HUSKY=0
ENV CI=1
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

COPY . .
RUN npm run build

FROM node:20-alpine AS runtime

WORKDIR /app
ENV NODE_ENV=production
ENV HUSKY=0
ENV CI=1
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --legacy-peer-deps
COPY --from=build /app/dist ./dist

EXPOSE 8080
CMD ["npm", "start"]
