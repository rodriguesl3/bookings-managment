import { ObjectId } from 'mongodb';
import { Restaurant } from '../../domain/Restaurant';
import * as repository from '../../repositories/MongoRepository';

jest.mock('../../repositories/IMongoRepository');

describe('RestaurantService', () => {
	it('returns restaurant object when correct id is informed', async () => {
		const restaurantMock: Restaurant = { open: 12, close: 15, id: '123', tables: 3 };

		jest.spyOn(repository.MongoRepository.prototype, 'getById').mockResolvedValue(restaurantMock);

		const instance = new repository.MongoRepository('something');
		const response = await instance.getById('123');

		expect(response).toEqual({ open: 12, close: 15, tables: 3, id: '123' });
	});
});
