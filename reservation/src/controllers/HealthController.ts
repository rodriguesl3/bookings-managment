import { Context } from "koa";
import Router from "koa-router";
import { IController } from "./IController";

export default class HealthController implements IController {
  public path = '/health';
  public router = new Router();

  constructor() {
    this.buildRoutes();
  }


  private buildRoutes() {
    this.router.get(`${this.path}/check`, this.healthCheck);
  }

  private healthCheck(context: Context) {
    context.status = 200;
    context.message = 'OK';
  }
}