import { type Request, type Response } from 'express';
import { Controller, Get, Injectable, Params, param, query, request, response } from "../decorators.js";
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
  @Params([ param('id'), query('addon'), request(), response() ])
  findOne(id: string, addon: string | undefined, req: Request, res: Response){
    return { id, addon };
  }

  //@Get(':id/edit')
  edit(){
    return 'edit';
  }
}