export type Constructor<T> = new (...args: any[]) => T

/* 
  1. Once on server startup
  2. Singletoons
*/
export class Container{
  protected instances = new Map<Constructor<unknown>, unknown>();

  resolve<T>(token: Constructor<T>){
    if(this.instances.has(token)){
      return this.instances.get(token) as T;
    }

    const meta = Reflect.getMetadata('design:paramtypes', token);

    if(meta === undefined && token.length > 0){
      throw new Error(token.name + ' have constructor Params, but have not @Injectable!');
    }

    const deps = (meta ?? []).map((dep: Constructor<T>) => this.resolve(dep));
    const instance = new token(...deps);
    this.instances.set(token, instance);

    return instance;
  }
}

/*
resolve(PostsController) ->
  meta = [ PostsService, AuthService ]
  res = [ PostsService ].map(
    0 => resolve(PostsService),
    1 => resolve(AuthService)
  )

  new PostsController(...res)

resolve(AuthService)
  meta = undefined, token.length = 0
  return new AuthService();

resolve(PostsService)
  meta = [ DbService ],
  res = [ DbService ].map(0 => resolve(DbService))

resolve(DbService)
  meta = undefined, token.length = 0
  return new DbService();
*/