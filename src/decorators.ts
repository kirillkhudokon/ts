import { Constructor } from './container.js';
import type { Request, Response } from 'express';

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

export type ParamResolver = (req: Request, res: Response) => unknown;

export interface RouteDefinition {
  method: HttpMethod;
  path: string;
  handler: string | symbol;
  params: ParamResolver[];
}

export const METADATA_ROUTES = Symbol('ROUTES');
export const METADATA_PARAMS = Symbol('PARAMS');

function createRouteDecorator(method: HttpMethod){
  return (path: string = '/') => {
    return (fn: (...args: any[]) => any, ctx: ClassMethodDecoratorContext) => {
      const params: ParamResolver[] = (fn as any)[METADATA_PARAMS] ?? [];
      (fn as any)[METADATA_ROUTES] = {
        method,
        path,
        handler: ctx.name,
        params,
      };
      return fn;
    }
  }
}

export const Get = createRouteDecorator('get');
export const Post = createRouteDecorator('post');
export const Put = createRouteDecorator('put');
export const Patch = createRouteDecorator('patch');
export const Delete = createRouteDecorator('delete');

export function Params(resolvers: ParamResolver[]) {
  return (fn: (...args: any[]) => any, ctx: ClassMethodDecoratorContext) => {
    if (resolvers.length !== fn.length) {
      throw new Error(
        `@Params on "${String(ctx.name)}": ${resolvers.length} resolver(s) provided but method has ${fn.length} parameter(s)`
      );
    }
    (fn as any)[METADATA_PARAMS] = resolvers;
    return fn;
  };
}

export const param    = (name: string): ParamResolver => (req) => req.params[name];
export const query    = (name: string): ParamResolver => (req) => req.query[name];
export const body     = (): ParamResolver => (req) => req.body;
export const request  = (): ParamResolver => (req) => req;
export const response = (): ParamResolver => (_req, res) => res;
