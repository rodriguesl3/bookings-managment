import { Document } from 'mongodb';
import { Restaurant } from '../domain/Restaurant';

export interface IMongoRepository {
	getById<T extends { id: string }>(id: string): Promise<T | null>;
	addRegister<T extends { id: string }>(document: T): Promise<string>;
}
