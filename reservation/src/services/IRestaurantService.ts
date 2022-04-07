import { Restaurant } from "../domain/Restaurant";

export interface IRestaurant {
  getById(id: string): Promise<Restaurant | null>;
}