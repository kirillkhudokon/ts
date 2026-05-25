import { createApp } from './src/bootstrap.js'
import PostsController from './src/controllers/posts.controller.js'

const app = createApp([
  PostsController
])

app.listen(3000)

/* class A{
  @Dec()
  b(){

  }
}

function Dec(path: string = '/'){
  return (value: any, ctx: ClassMethodDecoratorContext) => {
    console.log(value, ',', ctx);
    return value;
  }
} */