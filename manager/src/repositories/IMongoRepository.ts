import { Filter } from 'mongodb';

export interface IMongoRepository {
	getAll<T>(): Promise<T[]>;
	getByFilter<T>(filter: Filter<T>): Promise<T[] | null>;
	getById<T extends { id: string }>(id: string): Promise<T | null>;
	addRegister<T extends { id: string }>(document: T): Promise<string>;
	updateRegister<T extends { id: string }>(document: T): Promise<boolean>;
	deleteRegister<T extends { id: string }>(id: string): Promise<boolean>;
}
