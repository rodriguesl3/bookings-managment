export interface IRedisRepository {
	subscribeMessage<T>(): Promise<T | undefined>;
}
