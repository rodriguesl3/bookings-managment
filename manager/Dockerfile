FROM node:14 as builder
COPY . ./app
WORKDIR /app
RUN npm ci
RUN npm run build

FROM node:14.15.0-alpine
COPY --from=builder /app/dist /app
COPY --from=builder /app/node_modules /app/node_modules
WORKDIR /app/src

ENV MONGO_DATABASE=restaurants
ENV MONGO_SERVER=mongo
ENV REDIS_SERVER=redis://queue:6379
ENV NODE_ENV=production
ENV RESERVATION_API=http://reservation:8080

EXPOSE 8081

# Running the app
CMD "node" "server.js"
# CMD "/bin/sh"