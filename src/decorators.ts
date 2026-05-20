import 'reflect-metadata'

export function Injectable() : ClassDecorator{
  return target => {
    Reflect.defineMetadata('injectable', true, target)
  }
}

export const METADATA_CONTROLLER_PREFIX = Symbol();

export function Controller(prefix = ''): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(METADATA_CONTROLLER_PREFIX, prefix, target);
  };
}

export type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';

export interface RouteDefinition {
  method: HttpMethod;
  path: string;
  handler: string | symbol; // why i use symbol?
}

export const METADATA_ROUTES = Symbol();

function createRouteDecorator(method: HttpMethod){
  return (path: string = '/') : MethodDecorator => {
    return (target, handler) => {
      const routes: RouteDefinition[] = Reflect.getMetadata(METADATA_ROUTES, target.constructor) ?? [];
      
      routes.push({
        method,
        path,
        handler
      })
      
      Reflect.defineMetadata(METADATA_ROUTES, routes, target.constructor);
    }
  }
}

export const Get = createRouteDecorator('get'); 
export const Post = createRouteDecorator('post'); 
export const Put = createRouteDecorator('put'); 
export const Patch = createRouteDecorator('patch'); 
export const Delete = createRouteDecorator('delete'); 