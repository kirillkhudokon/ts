import { METADATA_DI } from "./decorators.js";

export type Constructor<T> = new (...args: any[]) => T

/* 
  1. Once on server startup
  2. Singletoons
*/
export class Container{
  protected instances = new Map<Constructor<unknown>, unknown>();

  resolve<T>(token: Constructor<T>) : T{
    if(this.instances.has(token)){
      return this.instances.get(token) as T;
    }

    const meta: Constructor<any>[] | undefined = (token as any)[METADATA_DI];

    if(meta === undefined && token.length > 0){
      throw new Error(token.name + ' have constructor Params, but have not @Injectable!');
    }

    if(meta && meta.length < token.length){
      throw new Error(token.name + ', @Injectable(HERE_LESS_PARAMS) than contructor(HERE)');
    }

    const deps = (meta ?? []).map((dep: Constructor<any>) => this.resolve(dep));
    const instance = new token(...deps);
    this.instances.set(token, instance);
    console.log(deps);
    return instance;
  }
}