import { Injectable } from "../decorators";
import DBService from "./db.service";

@Injectable()
export default class PostsService{
  constructor(protected db: DBService){}

  all(){
    return this.db.all();
  }

  one(id: number) : number | undefined{
    return this.db.all()[id];
  }
}