import { Injectable } from "../decorators.js";
import DBService from "./db.service.js";

@Injectable([ DBService ])
export default class PostsService{
  constructor(protected db: DBService){}

  all(){
    return this.db.all();
  }

  one(id: number) : number | undefined{
    return this.db.all()[id];
  }
}