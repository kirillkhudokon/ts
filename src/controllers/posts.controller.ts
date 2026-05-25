import { Controller, Get, Injectable } from "../decorators.js";
import { AuthServiceInterface } from "../interfaces.js";
import AuthService from "../services/auth.service.js";
import PostsService from "../services/posts.service.js";

@Injectable([ PostsService, AuthService ])
@Controller('posts')
export default class PostsController{
  constructor(
    protected postService: PostsService,
    protected authSevice: AuthServiceInterface
  ){}

  @Get()
  findAll(){
    return this.postService.all();
  }

  @Get(':id')
  // @Params([ param('id'), query('addon'), request() /* body,req,resp */ ])
  findOne(id: string, addon: string, r: Request){
    return 'here';
  }

  //@Get(':id/edit')
  edit(){
    return 'edit';
  }
}