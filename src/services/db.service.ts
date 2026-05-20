import { Injectable } from "../decorators";

@Injectable()
export default class DBService{
  public all(){
    return [1, 2, 3];
  }
}