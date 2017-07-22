import {Ingredient} from '../shared/ingredient';
import {Item} from "../recipes/Item";
import {Assignment} from "../recipes/Assignment";
import {Http, Response, Headers} from "@angular/http";
import 'rxjs/Rx';
import {Injectable, EventEmitter} from "@angular/core";
import {Observable} from "rxjs/Rx";

@Injectable()
export class ShoppingListService {
private items:Item[] = [];
private itemId:number;
private price;
private quantity;
cartChanged=new EventEmitter<Item[]>();
updateItemEvent=new EventEmitter<string>();
recipeAddedToShoppingCart=new EventEmitter<string>();
  deleteEvent=new EventEmitter<string>();
  constructor( private http: Http) {



  }
  setPrice(value){
    this.price=value;

  }
  setQuantity(value){
    this.quantity=value;
  }

  getPrice(){
   this.price= this.fetchNetPrice();
  return this.price;
  }
  getQuantity(){

   this.quantity= this.fetchNetQuantity();
    return this.quantity;
  }

  handleError(error:any)
  {
    console.log(error)
    return Observable.throw(error.json());
  }

  applyCouponCode(code:string){

    return this.http.get('api/cart?coupon='+code)
      .map((response:Response)=>response).catch(this.handleError);

  }
  public getItems()
  {
    console.log('data is set in s-list component items for display');
    return this.items;
  }
  setServiceItems(data:Item[]){
    console.log('data fetched from server is set in local shoppinglist items');
    this.items=data

  }

  getItemsFromServer()
  {
    console.log('back end call to fetch cart items is made getItemsFromServer()');
    return this.http.get('api/cart/items')
      .map((response:Response)=>response.json()).subscribe(
        (data:Item[])=> {
          this.cartChanged.emit(data);

        },
        error=>console.log(error)

      );

  }
 public  addItems(items:Item[])
  {
    Array.prototype.push.apply(this.items,items);

  }
  addItem(item:Item)
  {
    console.log('call to front end is made for storing data to sls items with id='+item.id);
    this.items.push(item);

    this.itemId=item.id;
    console.log(this.itemId);

  }
  addItemToServer(id:string)
  {
    console.log('call to backend is made for adding item to backend cart');
    const body='';
    const headers=new Headers();
    headers.append('Content-Type','text/plain');
    return this.http.post('api/cart/item/'+id+'/addItem',body,{headers:headers})
      .map((response:Response)=>response)
      .subscribe(
        data=> {

          this.recipeAddedToShoppingCart.emit(data.toString());
          console.log('recipeAddedToShoppingCart event is occurred with data ='+data.toString());

        },
        error=>console.log(error)
      );;


  }
  editItem(oldItem:Item,newItem:Item){
    console.log('backend call for updating quantity is made');

    const body=JSON.stringify(newItem);
    const headers=new Headers();
    headers.append('Content-Type','application/json');
    return this.http.put('api/cart/item/updateItem/'+oldItem.id,body,{headers:headers})
      .map((response:Response)=>response.toString())
      .subscribe(
        (data:string)=>this.updateItemEvent.emit(data)
      );


  }

  editItemOnFrontEnd(oldItem:Item,newItem:Item){
  console.log('call to update item on front end');
  this.items[this.items.indexOf(oldItem)]=newItem;

    this.getItemsFromServer();

}
  deleteItem(item:Item)
  {
    console.log('backend call for deleting item is made');

    return this.http.delete('/api/cart/item/deleteItem/'+item.id).map((response:Response)=>response.toString()).subscribe(
      (data:string)=>this.deleteEvent.emit(data)
    );
  }
  deleteItemFromFrontEnd(item:Item){
    console.log('call to delete item from front end');
  this.items.splice(this.items.indexOf(item),1);

    this.getItemsFromServer();
}

  fetchNetPrice(){
    console.log('price is fetched asynchronously from server');
    return this.http.get('api/cart/getNetPrice')
      .map((response:Response)=>response.json());

  }
  fetchNetQuantity(){
    console.log('quantity is fetched asynchronously from server');
    return this.http.get('api/cart/getNetQuantity')
      .map((response:Response)=>response.json());

  }
  clearCart(){

    return this.http.delete('/api/cart/cleanCart').map((response:Response)=>response);


  }



}
