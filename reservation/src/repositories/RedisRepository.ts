import { createClient } from 'redis';

export interface IRedisRepository {
	dispatchMessage<T>(message: T): Promise<number>;
}

export class RedisRepository implements IRedisRepository {
	constructor(private channel: string) {}

	private async getConnection() {
		const client = createClient({
			url: 'redis://127.0.0.1:6379',
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
