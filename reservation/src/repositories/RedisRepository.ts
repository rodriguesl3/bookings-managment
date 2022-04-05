import { createClient } from 'redis';
import { config } from '../config';

export interface IRedisRepository {
	dispatchMessage<T>(message: T): Promise<number>;
}

export class RedisRepository implements IRedisRepository {
	constructor(private channel: string) {}

	private async getConnection() {
		const client = createClient({
			url: config.redisServer,
		});
		await client.connect();
		return client;
	}

	async dispatchMessage<T>(message: T): Promise<number> {
		const client = await this.getConnection();

		const acknowledge = await client.rPush(this.channel, [JSON.stringify(message)]);

		return acknowledge;
	}
}
