import { Document } from 'mongodb';
import { Restaurant } from '../domain/Restaurant';

export interface IMongoRepository {
	getById<T extends { id: string }>(id: string): Promise<T | null>;
	addRegister<T>(document: T): Promise<void>;
}
