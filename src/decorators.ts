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

export type ParamResolver<T = unknown> = (req: Request, res: Response) => T;

// берем ретурн тайп от каждого елем тюпла
type ResolverArgs<T extends ParamResolver<any>[]> = {
  [K in keyof T]: ReturnType<T[K]> // можно через infer бахнуть, но так короче
};

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

// const T - строгий фикс типа, аналогия as const(не совсем верно, но в целом похоже). фиксируем порядок и тип
export function Params<const T extends ParamResolver<any>[]>(resolvers: T) {
  return <V extends (...args: ResolverArgs<T>) => any>(fn: V, ctx: ClassMethodDecoratorContext): V => {
    if (resolvers.length !== fn.length) {
      throw new Error('Params mismatch');
    }
    (fn as any)[METADATA_PARAMS] = resolvers;
    return fn;
  };
}

export const param = (name: string): ParamResolver<string> => (req) => req.params[name] as string;
export const query = (name: string): ParamResolver<string | undefined> => (req) => req.query[name] as string | undefined;
export const body = <T = unknown>(): ParamResolver<T> => (req) => req.body as T;
export const request = (): ParamResolver<Request> => (req) => req;
export const response = (): ParamResolver<Response> => (_req, res) => res;
