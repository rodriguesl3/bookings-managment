import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from 'koa2-cors';
import logger from 'koa-logger';
import { config } from '../config'
import { IController } from '../controllers/IController';

export default class App {
  public app: Koa;
  private port: number = config.port;

  constructor(controllers: IController[]) {
    this.app = new Koa();
    this.loadMiddleware();
    this.loadControllerInstances(controllers);
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.info(`App listening on port ${this.port}`);
    })
  }

  private loadMiddleware() {
    this.app.use(cors({ origin: '*' }));
    this.app.use(bodyParser());
    this.app.use(logger());
  }

  private loadControllerInstances(controllers: IController[]) {
    controllers.forEach((controller) => {
      this.app.use(controller.router.routes());
    });
  }
}
