import { IRedisRepository } from './IRedisRepository';
import { createClient } from 'redis';
import { config } from '../config';

export class RedisRepository implements IRedisRepository {
	constructor(private channel: string) {}

	private async getConnection() {
		const client = createClient({
			url: config.redisServer,
		});
		await client.connect();
		return client;
	}

	async subscribeMessage<T>(): Promise<T | undefined> {
		const client = await this.getConnection();
		const message = await client.lPop(this.channel);

		if (!message) {
			return undefined;
		}

		return JSON.parse(message) as T;
	}
}
