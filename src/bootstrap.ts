import { Constructor, Container } from "./container.js";
import express, { Request, Response } from 'express';
import { METADATA_CONTROLLER_PREFIX, METADATA_ROUTES, RouteDefinition } from "./decorators.js";

export function createApp(controllers: Constructor<any>[]){
  const container = new Container();
  const app = express();
  app.use(express.json());

  for(const ControllerClass of controllers){
    const routes: RouteDefinition[] = [];

    for (const key of Object.getOwnPropertyNames(ControllerClass.prototype)){
      const fn = ControllerClass.prototype[key];

      if(typeof fn === 'function' && key !== 'constructor'){
        const route: RouteDefinition | undefined = fn[METADATA_ROUTES]
        
        if(route){
          routes.push(route);
        }
      }
    }

    const prefix: string = (ControllerClass as any)[METADATA_CONTROLLER_PREFIX];
    const instance = container.resolve(ControllerClass);
    
    for( const route of routes){
      app[route.method](
        ('/' + prefix + '/' + route.path).replace(/\/{2,}/g, '/'),
        async (req, resp) => {
          const args = route.params.map(resolve => resolve(req, resp));
          const result = await instance[route.handler].apply(instance, args);
          resp.end(JSON.stringify(result));
        }
      )
    }
  }

  return app;
}