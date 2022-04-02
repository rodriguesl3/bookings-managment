FROM node:14 as builder
COPY . ./app
WORKDIR /app
RUN npm ci
RUN npm run build



FROM node:14.15.0-alpine
COPY --from=builder /app/dist /app
WORKDIR /app
ENV NODE_ENV=production

# Running the app
CMD "npm" "start"