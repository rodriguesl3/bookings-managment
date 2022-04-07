export const config = {
	port: +(process.env.NODE_PORT ?? '8080'),
	mongoDatabase: process.env.MONGO_DATABASE ?? 'restaurants',
	mongoServer: process.env.MONGO_SERVER ?? 'localhost',
	redisServer: process.env.REDIS_SERVER,
};
