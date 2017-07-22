import { Component, OnInit } from '@angular/core';
import {ShoppingListService} from "./shopping-list.service";
import {Ingredient} from '../shared/ingredient';
import {Item} from "../recipes/Item";

@Component({
  selector: 'rb-shopping-list',
  templateUrl: './shopping-list.component.html'
})
export class ShoppingListComponent implements OnInit {
  items:Item[]=[];
  selectedItem: Item=null;
  private asyncPrice;
  private asyncQuantity;
  constructor(private shoppingListService:ShoppingListService) { }

  ngOnInit() {
    console.log('oninit of shoppinglist component is called');
    this.shoppingListService.getItemsFromServer();
    this.shoppingListService.cartChanged.subscribe(
      (data:Item[])=>{
        console.log('data is emmited from cart changed event');
        this.shoppingListService.setServiceItems(data);
        this.items=this.shoppingListService.getItems();
        this.asyncPrice=this.shoppingListService.getPrice();//this.shoppingListService.fetchNetPrice();
        this.asyncQuantity=this.shoppingListService.getQuantity();//this.shoppingListService.fetchNetQuantity();

      }


    );
  }
  onSelectItem(item:Item){


    this.selectedItem=item;

  }
  onCleared()
  {
    this.selectedItem=null;

  }
}
