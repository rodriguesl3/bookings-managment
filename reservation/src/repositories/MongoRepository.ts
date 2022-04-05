import { MongoClient, ObjectId } from 'mongodb';
import { config } from '../config';
import { IMongoRepository } from './IMongoRepository';

export class MongoRepository implements IMongoRepository {
	private server?: string = config.mongoServer;
	private database?: string = config.mongoDatabase ?? '';

	constructor(private collection: string) {}

	protected async getConnection() {
		if (!this.server || !this.database) {
			throw new Error('MongoDB connection error');
		}

		const client = await MongoClient.connect(`mongodb://${this.server}:27017`);
		const db = client.db(this.database);
		return db.collection(this.collection);
	}

	async getById<T extends { id: string }>(id: string): Promise<T | null> {
		const collection = await this.getConnection();
		return collection.findOne({ id }) as Promise<T | null>;
	}

	async addRegister<T extends { id: string }>(document: T): Promise<string> {
		const collection = await this.getConnection();
		const response = await collection.insertOne({ ...document, _id: new ObjectId(document.id) });
		return response.insertedId.toJSON();
	}
}
