import { Controller, Get, Injectable } from "../decorators";
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
  findAll(){
    return this.postService.all();
  }

  @Get(':id')
  findOne(){
    return 1;
  }

  /*  
  @Get(':id')
  findOne(@Param() id: string){
    return 1;
  }

  @Post()
  findOne(@Body() body: unknown){
    return 1;
  }
  */

  @Get(':id/edit')
  edit(){
    return 'edit';
  }
}