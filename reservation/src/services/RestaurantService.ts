import { Restaurant } from "../domain/Restaurant";
import { IMongoRepository } from "../repositories/IMongoRepository";
import { IRestaurant } from "./IRestaurantService";

export class RestaurantService implements IRestaurant {

  constructor(private repository: IMongoRepository) { }

  getById(id: string): Promise<Restaurant | null> {
    return this.repository.getById<Restaurant>(id);
  }
}