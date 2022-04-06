export interface IMongoRepository {
	getAll<T>(): Promise<T[]>;
	getById<T extends { id: string }>(id: string): Promise<T | null>;
	addRegister<T extends { id: string }>(document: T): Promise<string>;
	updateRegister<T extends { id: string }>(document: T): Promise<boolean>;
	deleteRegister<T extends { id: string }>(document: T): Promise<boolean>;
}
