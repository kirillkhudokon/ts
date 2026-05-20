import { Constructor, Container } from "./container";
import express from 'express';
import { METADATA_CONTROLLER_PREFIX, METADATA_ROUTES, RouteDefinition } from "./decorators";

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
          const result = await instance[route.handler].call(instance);
          resp.end(JSON.stringify(result));
        }
      )
    }
  }

  return app;
}