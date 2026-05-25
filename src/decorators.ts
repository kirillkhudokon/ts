import { Constructor } from './container.js';

type ConstructorList<Deps extends any[]> = {
  [K in keyof Deps]: Constructor<Deps[K]>
}

export const METADATA_DI = Symbol('DI');

export function Injectable<Deps extends any[] = []>(deps?: ConstructorList<Deps>){
  return function<T extends new (...agrs: Deps) => any>(value: T, _ctx: ClassDecoratorContext) : T{
    (value as any)[METADATA_DI] = deps;
    return value;
  };
}

export const METADATA_CONTROLLER_PREFIX = Symbol('CONTROLLER_PREFIX');

export function Controller(prefix = '') {
  return function<T>(value: Constructor<T>, _ctx: ClassDecoratorContext){
    (value as any)[METADATA_CONTROLLER_PREFIX] = prefix;
    return value;
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
  return (path: string = '/') => {
    return (fn: (...args: any[]) => any, ctx: ClassMethodDecoratorContext) => {
      (fn as any)[METADATA_ROUTES] = {
        method,
        path,
        handler: ctx.name
      }

      return fn;
    }
  }
}

export const Get = createRouteDecorator('get'); 
export const Post = createRouteDecorator('post'); 
export const Put = createRouteDecorator('put'); 
export const Patch = createRouteDecorator('patch'); 
export const Delete = createRouteDecorator('delete'); 