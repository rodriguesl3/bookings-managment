import HealthController from './controllers/HealthController';
import RestaurantController from './controllers/RestaurantControllers';
import App from './loaders/app';

const app = new App([new HealthController(), new RestaurantController()]);

app.listen();
