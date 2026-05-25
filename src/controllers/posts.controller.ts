import { Body, Controller, Get, Injectable, Param, Post, Query } from "../decorators";
import AuthService from "../services/auth.service";
import PostsService from "../services/posts.service";

@Injectable()
@Controller('posts')
export default class PostsController{
  constructor(
    protected postService: PostsService,
    protected authSevice: AuthService
  ){}

  @Get()
  findAll(@Query('limit') limit: string){
    return this.postService.all();
  }

  @Get(':id')
  findOne(@Param('id') id: string){
    return id;
  }

  @Post()
  create(@Body() body: unknown){
    return body;
  }

  @Get(':id/edit')
  edit(){
    return 'edit';
  }
}