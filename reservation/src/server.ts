import { config } from 'dotenv';
import HealthController from './controllers/HealthController';
import ReservationController from './controllers/ReservationController';
import App from './loaders/app';

if (!process.env.NODE_ENV) {
	config();
}

const app = new App([new ReservationController(), new HealthController()]);

app.listen();
