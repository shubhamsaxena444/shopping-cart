import {Item} from "./Item";
export class Assignment extends Item {


  constructor(public name, public id,public type,public price,public quantity,  public imagePath,public guideId) {
    super(name, id, type, price, quantity, imagePath);

  }
}
