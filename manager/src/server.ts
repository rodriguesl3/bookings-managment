import HealthController from './controllers/HealthController';
import ReservationController from './controllers/ReservationController';
import RestaurantController from './controllers/RestaurantControllers';
import App from './loaders/app';

const app = new App([new HealthController(), new RestaurantController(), new ReservationController()]);

app.listen();
