import 'reflect-metadata'
import { createApp } from './src/bootstrap'
import PostsController from './src/controllers/posts.controller'

/* import PostsController from "./src/controllers/posts.controller";
import { Container } from './src/container';
import { METADATA_ROUTES } from './src/decorators';

const container = new Container();
const postsCtrl = container.resolve(PostsController);
console.log(postsCtrl.findAll());

console.log(Reflect.getMetadata(METADATA_ROUTES, PostsController)) */

const app = createApp([
  PostsController
])

app.listen(3000)