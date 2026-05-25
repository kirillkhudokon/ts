import { Constructor, Container } from "./container";
import express from 'express';
import { METADATA_CONTROLLER_PREFIX, METADATA_ROUTES, METADATA_PARAMS, ParamDefinition, RouteDefinition } from "./decorators";

export function createApp(controllers: Constructor<any>[]){
  const container = new Container();
  const app = express();
  app.use(express.json());

  for(const ControllerClass of controllers){
    const prefix: string = Reflect.getMetadata(METADATA_CONTROLLER_PREFIX, ControllerClass);
    const routes: RouteDefinition[] = Reflect.getMetadata(METADATA_ROUTES, ControllerClass);

    const instance = container.resolve(ControllerClass);
    
    for( const route of routes){
      app[route.method](
        ('/' + prefix + '/' + route.path).replace(/\/{2,}/g, '/'), 
        async (req, resp) => {
          const paramDefs: ParamDefinition[] = Reflect.getMetadata(METADATA_PARAMS, Object.getPrototypeOf(instance), route.handler) ?? [];
          const args = [];
          for (const p of paramDefs) {
            if (p.source === 'param') {
              args[p.index] = p.key ? req.params[p.key] : req.params;
            } else if (p.source === 'body') {
              args[p.index] = p.key ? req.body[p.key] : req.body 
            } else if (p.source === 'query') { 
              args[p.index] = p.key ? req.query[p.key] : req.query;
            }
          }
          const result = await instance[route.handler].call(instance, ...args);
          resp.end(JSON.stringify(result));
        }
      )
    }
  }

  return app;
}