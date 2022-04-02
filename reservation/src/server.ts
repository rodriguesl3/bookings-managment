import HealthController from './controllers/HealthController';
import App from './loaders/app';

const app = new App([
  new HealthController()
]);

app.listen();