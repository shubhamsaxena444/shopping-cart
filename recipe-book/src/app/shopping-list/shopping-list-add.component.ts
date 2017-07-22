import {Component, OnInit, Input, OnChanges, EventEmitter, Output} from '@angular/core';
import {Ingredient} from "../shared/ingredient";
import {ShoppingListService} from "./shopping-list.service";
import {Item} from "../recipes/Item";
import {FormGroup} from "@angular/forms";
import {error} from "util";
import any = jasmine.any;
import {Observable} from "rxjs";

@Component({
  selector: 'rb-shopping-list-add',
  templateUrl: './shopping-list-add.component.html'
})
export class ShoppingListAddComponent implements OnChanges {


  @Input() item:Item;
  @Input() coupon:string;
  @Output() cleared =new EventEmitter();
  isAdd=true;
  couponClicked=false;
  asyncMessage;
  constructor(private sls:ShoppingListService) { }

  applyCoupon(val:string){
    this.couponClicked=true;

    console.log(val);
    //this.asyncMessage=
      this.sls.applyCouponCode(val)
      .subscribe(
      data=>console.log(data.json()),
      error=>console.log(error)
    );
    this.sls.getItemsFromServer();
    this.onClear();

  }


  onSubmit(ingredient: FormGroup)
  {
    if(!this.isAdd)
    {
      this.sls.editItem(this.item,new Item(this.item.name,this.item.id,this.item.type,this.item.price,this.item.quantity,this.item.imagePath));
      this.sls.updateItemEvent.subscribe(
        (data:string)=>{

          console.log('data emitted by updated item event is '+data);
          this.sls.editItemOnFrontEnd(this.item,new Item(this.item.name,this.item.id,this.item.type,this.item.price,this.item.quantity,this.item.imagePath));
        },
        error=>console.log(error)
      );
      this.onClear();
    }
    else
    {
    //  this.item=new Item(ingredient.name,ingredient.id,ingredient.type,ingredient.price,ingredient.quantity,ingredient.imagePath);
      //this.sls.addItem(this.item);

    }
  }

  onDelete(){
    this.sls.deleteItem(this.item);
    this.sls.deleteEvent.subscribe(
      (data:string)=>{

        console.log('data emitted by deleteEvent is '+data);
        this.sls.deleteItemFromFrontEnd(this.item);
        this.sls.setPrice(this.sls.getPrice());
        this.sls.setQuantity(this.sls.getQuantity());
      },
      error=>console.log(error)
    );
    this.onClear();

  }
  onClear(){
    this.isAdd=true;
    this.cleared.emit(null);

  }
  onClearCart(){

    this.sls.clearCart().subscribe(

      (data)=>console.log(data),
      (error)=>console.log(error),

    );
    this.sls.getItemsFromServer();
  }

  ngOnChanges(changes){
    if(changes.item.currentValue===null)
    {
        this.isAdd=true;
    this.item={name:null,price:null,id:null,type:null,quantity:null,imagePath:null};
    }else
    {
      this.isAdd=false;

    }

}

}
