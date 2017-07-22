import {Component, Input} from '@angular/core';
import {Recipe} from "../recipe";
import {Item} from "../Item";

@Component({
  selector: 'rb-recipe-item',
  templateUrl: './recipe-item.component.html'
})
export class RecipeItemComponent {
  @Input() recipe: Item;
  @Input() recipeId: number;


}
