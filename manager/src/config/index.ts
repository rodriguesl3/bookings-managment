export const config = {
	port: +(process.env.NODE_PORT ?? '8081'),
	mongoDatabase: process.env.MONGO_DATABASE ?? 'restaurants',
	mongoServer: process.env.MONGO_SERVER ?? 'localhost',
	redisServer: process.env.REDIS_SERVER,
	reservationApi: process.env.RESERVATION_API ?? 'http://localhost:8080',
};
