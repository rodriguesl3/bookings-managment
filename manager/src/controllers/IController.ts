import Router from "koa-router";

export interface IController {
  path: string;
  router: Router;
}